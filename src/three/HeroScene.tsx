import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import { usePointer } from '../hooks/usePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'

function Crystal() {
  const ref = useRef<Group>(null)
  const wire = useRef<Mesh>(null)
  const pointer = usePointer()
  const reduced = useReducedMotion()

  useFrame((_state, delta) => {
    const group = ref.current
    if (!group) return
    if (!reduced) {
      group.rotation.y += delta * 0.12
      group.rotation.x += delta * 0.05
      group.position.x += (pointer.current.x * 0.28 - group.position.x) * 0.045
      group.position.y += (-pointer.current.y * 0.18 - group.position.y) * 0.045
    }
    if (wire.current) wire.current.rotation.y -= delta * 0.28
  })

  return (
    <group ref={ref}>
      <Float speed={reduced ? 0 : 1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh castShadow>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshStandardMaterial color="#0b0b0b" metalness={0.92} roughness={0.18} flatShading />
        </mesh>
        <mesh ref={wire} scale={1.035}>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshBasicMaterial color="#d90f1f" wireframe transparent opacity={0.82} />
        </mesh>
        <mesh scale={1.42} rotation={[Math.PI / 2.6, 0.4, 0]}>
          <torusGeometry args={[1.15, 0.004, 8, 120]} />
          <meshBasicMaterial color="#f4f1ec" transparent opacity={0.35} />
        </mesh>
      </Float>
    </group>
  )
}

export default function HeroScene() {
  const reduced = useReducedMotion()
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={reduced ? 'demand' : 'always'}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff5ee" />
          <pointLight position={[-4, -2, 2]} intensity={22} color="#d90f1f" distance={12} />
          <Crystal />
          {!reduced && <Sparkles count={34} scale={[11, 7, 4]} size={1.6} speed={0.28} opacity={0.35} color="#f4f1ec" />}
        </Suspense>
      </Canvas>
    </div>
  )
}
