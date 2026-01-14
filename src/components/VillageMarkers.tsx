import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import type { Village } from '../types'

interface VillageMarkerProps {
  village: Village
  filter: string
  onSelect: (village: Village) => void
}

function VillageMarker({ village, filter, onSelect }: VillageMarkerProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHover] = useState(false)

  // Animate marker
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime()
      // Bob up and down slightly, offset by random factor based on x/z to desync
      meshRef.current.position.y = 0.5 + Math.sin(t * 2 + village.coordinates.x) * 0.1
    }
  })

  const getBaseColor = () => {
    if (hovered) return "#D4AF37"
    switch (filter) {
      case 'history': return "#9333EA" // Purple
      case 'schools': return "#3B82F6" // Blue
      case 'businesses': return "#10B981" // Green
      default: return "#00FFFF" // Cyan
    }
  }

  const color = getBaseColor()

  return (
    <group position={[village.coordinates.x, 0, village.coordinates.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(village)
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 1}
          toneMapped={false} // Helps with bloom later
        />
      </mesh>

      {/* Label */}
      <Html position={[0, 1, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div className={`
          px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all duration-300
          ${hovered ? 'bg-gold/80 text-black scale-110' : 'bg-black/50 text-white backdrop-blur-sm'}
        `}>
          {village.name}
        </div>
      </Html>

      {/* Ground ripple/ring effect (static for now) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

interface VillageMarkersProps {
  villages: Village[]
  filter: string
  onSelect: (village: Village) => void
}

export function VillageMarkers({ villages, filter, onSelect }: VillageMarkersProps) {
  return (
    <group>
      {villages.map((village) => (
        <VillageMarker key={village.id} village={village} filter={filter} onSelect={onSelect} />
      ))}
    </group>
  )
}
