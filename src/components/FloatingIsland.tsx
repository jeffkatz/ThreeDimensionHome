import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { Mesh } from 'three'

export function FloatingIsland() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime()
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.2
      meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.02
    }
  })

  return (
    <group ref={meshRef}>
      {/* Top Surface */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[12, 11, 0.5, 64]} />
        <meshStandardMaterial
          color="#1A472A"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Rocky Underside */}
      <mesh position={[0, -3, 0]}>
        {/* Inverted cone-ish shape for floating island look */}
        <coneGeometry args={[11, 6, 64]} />
        <MeshDistortMaterial
          color="#2C1A0B" // Dark Earth
          speed={0.2}
          distort={0.4}
          radius={1}
        />
      </mesh>

      {/* Gold Rim / Water Edge */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[11.8, 12.2, 128]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      {/* Floating Particles (Sparkles) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 5 - 2,
            (Math.random() - 0.5) * 20
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}
