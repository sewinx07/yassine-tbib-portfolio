import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useReducedMotion } from '../hooks/useReducedMotion'

function Object() {
  const ref = useRef<Group>(null)
  const reduced = useReducedMotion()
  useFrame((_, delta) => {
    if (!ref.current || reduced) return
    ref.current.rotation.y += delta * 0.22
    ref.current.rotation.z += delta * 0.06
  })
  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color="#0b0b0b" metalness={1} roughness={0.22} flatShading />
      </mesh>
      <mesh scale={1.02}>
        <octahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#d90f1f" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.7}>
        <torusGeometry args={[1.35, 0.003, 6, 100]} />
        <meshBasicMaterial color="#f4f1ec" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

export default function ContactObject() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 4]} intensity={3} color="#ffffff" />
        <pointLight position={[-3, -2, 2]} intensity={12} color="#d90f1f" distance={10} />
        <Object />
      </Canvas>
    </div>
  )
}
