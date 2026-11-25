/**
 * npm run portrait -- <path-to-photo>
 * Thin cross-platform wrapper around scripts/portrait.py.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const photo = process.argv[2]

if (!photo) {
  console.error('Usage: npm run portrait -- <path-to-photo>')
  process.exit(1)
}

const candidates = process.platform === 'win32' ? ['python'] : ['python3', 'python']
const python = candidates.find((command) => spawnSync(command, ['--version'], { stdio: 'ignore' }).status === 0)

if (!python) {
  console.error('Python 3 is required. Install it, then install the portrait dependencies (see README.md).')
  process.exit(1)
}

const result = spawnSync(python, [path.join(root, 'scripts', 'portrait.py'), photo], {
  cwd: root,
  stdio: 'inherit',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
