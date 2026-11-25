#!/usr/bin/env python3
"""Regenerate the hero portrait pipeline from a new source photo.

Usage: python scripts/portrait.py <path-to-photo>

Steps: background removal (rembg), framing/edge cleanup, colour grade,
MiDaS depth map, WebP/AVIF variants at 1x/2x, Open Graph image. Existing
published assets are copied to public/assets/_archive/ before replacement.

The input photo is never modified. First run downloads the rembg and MiDaS
models into the user cache; later runs work offline.
"""

from __future__ import annotations

import os
import shutil
import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy.ndimage import distance_transform_edt

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
PORTRAIT_DIR = ASSETS / "portrait"
ARCHIVE = ASSETS / "_archive"
TARGET = (1196, 1596)
HEAD_TOP_RATIO = 0.146  # matches the existing cutout's head position
MIDAS_SIZE = (256, 256)
MIDAS_URL = "https://github.com/isl-org/MiDaS/releases/download/v2_1/model-small.onnx"
MODEL_DIR = Path(os.environ.get("XDG_CACHE_HOME", str(Path.home() / ".cache"))) / "portfolio-portrait-models"
BONE = (244, 241, 236)
CRIMSON = (217, 15, 31)
DIM = (176, 168, 166)


def log(message: str) -> None:
    print(f"[portrait] {message}", flush=True)


def load_source(path: Path) -> Image.Image:
    if not path.is_file():
        raise SystemExit(f"Photo introuvable: {path}")
    image = Image.open(path)
    image.load()
    return image.convert("RGB")


def archive_existing() -> None:
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    for source in [
        PORTRAIT_DIR / "portrait.webp",
        PORTRAIT_DIR / "portrait-depth.webp",
        ASSETS / "hero-og.jpg",
    ]:
        target = ARCHIVE / source.name
        if source.is_file() and not target.exists():
            shutil.copy2(source, target)
            log(f"archived {source.relative_to(ROOT)} -> {target.relative_to(ROOT)}")


def remove_background(image: Image.Image) -> Image.Image:
    from rembg import new_session, remove

    model = os.environ.get("PORTRAIT_REMBG_MODEL", "isnet-general-use")
    log(f"background removal with rembg/{model} (first run downloads the model)")
    session = new_session(model)
    cutout = remove(
        image,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=245,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=5,
    )
    return cutout.convert("RGBA")


def align_framing(cutout: Image.Image) -> Image.Image:
    """Keep the head position and horizontal centring of the current cutout."""
    alpha = np.array(cutout)[:, :, 3]
    height, width = alpha.shape
    ys, xs = np.where(alpha > 24)
    if not len(ys):
        raise SystemExit("Aucun sujet détecté dans la photo.")
    head_xs = np.where(alpha[: int(height * 0.35)] > 24)[1]
    center_x = float(head_xs.mean()) if len(head_xs) else float(xs.mean())
    dx = int(round(width / 2 - center_x))
    dy = int(round(height * HEAD_TOP_RATIO - ys.min()))
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    canvas.paste(cutout, (dx, dy))
    log(f"framing offset dx={dx:+d} dy={dy:+d}")
    return canvas


def clean_edges(cutout: Image.Image) -> Image.Image:
    """Remove white/dark fringe from semi-transparent pixels, then grade softly."""
    rgba = np.array(cutout).astype(np.uint8)
    alpha = rgba[:, :, 3]
    opaque = alpha > 245
    if not opaque.any():
        raise SystemExit("Le détourage n'a produit aucun pixel opaque.")

    # Replace edge colours with the nearest fully opaque subject colour.
    _, indices = distance_transform_edt(~opaque, return_indices=True)
    nearest = rgba[indices[0], indices[1], :3]
    rgb = rgba[:, :, :3].copy()
    fringe = alpha < 250
    rgb[fringe] = nearest[fringe]

    # Mild unsharp mask for hair/cloth definition, without halos.
    blur = cv2.GaussianBlur(rgb, (0, 0), 1.1)
    rgb = cv2.addWeighted(rgb, 1.08, blur, -0.08, 0)

    # Subtle dark/crimson grade: a touch of contrast, cool shadows.
    x = rgb.astype(np.float32) / 255.0
    x = np.clip((x - 0.5) * 1.05 + 0.5, 0, 1)
    luminance = x[..., 0] * 0.2126 + x[..., 1] * 0.7152 + x[..., 2] * 0.0722
    shadow = np.clip(1 - luminance, 0, 1) ** 2
    tint = np.stack([-3.0 * shadow + 3.0 * luminance, 0.0 * shadow, 7.0 * shadow + luminance], axis=-1)
    rgb = np.clip(x + tint / 255.0, 0, 1)

    soft_alpha = cv2.GaussianBlur(alpha.astype(np.float32), (0, 0), 0.55)
    soft_alpha[soft_alpha < 6] = 0
    result = np.dstack([(rgb * 255).astype(np.uint8), soft_alpha.astype(np.uint8)])
    return Image.fromarray(result, "RGBA")


def alpha_of(image: Image.Image) -> np.ndarray:
    return np.array(image)[:, :, 3].astype(np.float32) / 255.0


def save_variants(image: Image.Image, stem: str, *, avif: bool = True) -> None:
    for suffix, size in (("", TARGET), ("@1x", (TARGET[0] // 2, TARGET[1] // 2)), ("@2x", TARGET)):
        variant = image if size == image.size else image.resize(size, Image.Resampling.LANCZOS)
        webp = PORTRAIT_DIR / f"{stem}{suffix}.webp"
        variant.save(webp, "WEBP", quality=82, method=6)
        if avif:
            variant.save(PORTRAIT_DIR / f"{stem}{suffix}.avif", "AVIF", quality=55, speed=6)


def midas_session() -> ort.InferenceSession:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    model = MODEL_DIR / "midas-small.onnx"
    if not model.is_file() or model.stat().st_size < 10_000_000:
        log("downloading MiDaS small (~64 MB, once)")
        urllib.request.urlretrieve(MIDAS_URL, model)
    return ort.InferenceSession(str(model), providers=["CPUExecutionProvider"])


def generate_depth(image: Image.Image, alpha: np.ndarray) -> Image.Image:
    session = midas_session()
    small = np.asarray(image.resize(MIDAS_SIZE, Image.Resampling.LANCZOS), dtype=np.float32) / 255.0
    small = small[..., ::-1]  # MiDaS small was exported with BGR input
    small = (small - np.array([0.485, 0.456, 0.406], dtype=np.float32)) / np.array(
        [0.229, 0.224, 0.225], dtype=np.float32
    )
    tensor = small.transpose(2, 0, 1)[None].copy()
    raw = session.run(None, {session.get_inputs()[0].name: tensor})[0][0]
    raw = cv2.resize(raw, TARGET, interpolation=cv2.INTER_CUBIC)
    lo, hi = np.percentile(raw, (2, 98))
    relative = np.clip((raw - lo) / max(hi - lo, 1e-6), 0, 1)

    soft = cv2.GaussianBlur(alpha, (0, 0), 12)
    subject = 58 + 205 * relative
    background = 52 + 8 * np.linspace(0, 1, TARGET[1], dtype=np.float32)[:, None]
    depth = background * (1 - soft) + subject * soft
    depth = cv2.GaussianBlur(depth.astype(np.float32), (0, 0), 2.5)
    gray = np.clip(depth, 0, 255).astype(np.uint8)
    return Image.fromarray(np.dstack([gray, gray, gray]), "RGB")


def font(name: str, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        ROOT / "node_modules" / "@fontsource" / name / "files" / f"{name}-latin-400-normal.woff",
        ROOT / "node_modules" / "@fontsource" / "manrope" / "files" / "manrope-latin-700-normal.woff",
    ]
    for path in candidates:
        if path.is_file():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def draw_tracking(draw: ImageDraw.ImageDraw, text: str, face, xy, fill, tracking: int) -> None:
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=face, fill=fill)
        x += draw.textlength(char, font=face) + tracking


def make_og(cutout: Image.Image) -> Image.Image:
    width, height = 1200, 630
    yy = np.linspace(0, 1, height, dtype=np.float32)[:, None, None]
    xx = np.linspace(0, 1, width, dtype=np.float32)[None, :, None]
    left = np.array([29, 8, 13], dtype=np.float32)
    right = np.array([70, 8, 13], dtype=np.float32)
    background = (left * (1 - xx) + right * xx) * (1 - 0.12 * yy)
    glow = np.exp(-(((np.arange(width)[None, :] - 900) / 260) ** 2 + ((np.arange(height)[:, None] - 280) / 230) ** 2))
    background += glow[..., None] * np.array([28, 0, 9], dtype=np.float32)
    canvas = Image.fromarray(np.clip(background, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

    display = font("anton", 86)
    label = font("manrope", 19)
    portrait_h = 640
    portrait_w = round(cutout.width * portrait_h / cutout.height)
    portrait = cutout.resize((portrait_w, portrait_h), Image.Resampling.LANCZOS)
    x, y = 724, 12
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    mask = portrait.getchannel("A").filter(ImageFilter.GaussianBlur(18))
    shadow.paste((0, 0, 0, 120), (x + 10, y + 16), mask)
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.alpha_composite(portrait, (x, y))

    draw = ImageDraw.Draw(canvas)
    draw_tracking(draw, "MULTIMEDIA DESIGNER", label, (58, 168), CRIMSON, 2)
    draw.rectangle((60, 205, 180, 207), fill=CRIMSON)
    draw.text((54, 222), "YASSINE", font=display, fill=BONE, stroke_width=0)
    draw.text((54, 312), "T", font=display, fill=CRIMSON)
    draw.text((54 + draw.textlength("T", font=display), 312), "BIB", font=display, fill=BONE)
    draw_tracking(draw, "PORTFOLIO · GABÈS, TN", label, (60, 428), DIM, 1)
    return canvas.convert("RGB")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        raise SystemExit("Usage: npm run portrait -- <path-to-photo>")
    source = Path(argv[1]).expanduser().resolve()
    if source in {p.resolve() for p in PORTRAIT_DIR.glob("*.webp")}:
        raise SystemExit("Choisissez la photo d'origine, pas un asset publié.")

    PORTRAIT_DIR.mkdir(parents=True, exist_ok=True)
    photo = load_source(source)
    log(f"source {source.name} {photo.width}x{photo.height}")
    archive_existing()

    scaled = photo.resize(TARGET, Image.Resampling.LANCZOS)
    cutout = clean_edges(align_framing(remove_background(scaled)))
    save_variants(cutout, "portrait")

    depth = generate_depth(scaled, alpha_of(cutout))
    save_variants(depth, "portrait-depth", avif=False)

    og = make_og(cutout)
    og.save(ASSETS / "hero-og.jpg", "JPEG", quality=88, optimize=True, progressive=True)

    for path in [
        PORTRAIT_DIR / "portrait.webp",
        PORTRAIT_DIR / "portrait.avif",
        PORTRAIT_DIR / "portrait-depth.webp",
        ASSETS / "hero-og.jpg",
    ]:
        log(f"{path.relative_to(ROOT)} — {path.stat().st_size / 1024:.1f} KB")
    log("done. Original photo untouched; previous assets are in public/assets/_archive/.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
