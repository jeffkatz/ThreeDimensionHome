import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export function FloatingIsland() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle bobbing animation
      const t = state.clock.getElapsedTime()
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.2
      // Very slow rotation
      // meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.05
    }
  })

  return (
    <group>
      {/* Main Terrain Base */}
      <mesh ref={meshRef} receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[12, 10, 1, 64]} />
        <meshStandardMaterial
          color="#1A472A"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Stylized "Water" or "Void" rim */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[10, 0, 2, 64]} />
        <meshStandardMaterial color="#D4AF37" opacity={0.3} transparent />
      </mesh>
    </group>
  )
}
