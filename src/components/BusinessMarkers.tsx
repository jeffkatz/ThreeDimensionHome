import { useRef, useMemo, useEffect, useState } from 'react'
import { InstancedMesh, Object3D, Color } from 'three'
import { businesses, villages } from '../lib/data'
import { Html } from '@react-three/drei'

export function BusinessMarkers() {
  const meshRef = useRef<InstancedMesh>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const tempObject = useMemo(() => new Object3D(), [])
  const tempColor = useMemo(() => new Color(), [])

  // Create business positions around their villages
  const businessData = useMemo(() => {
    return businesses.map((biz) => {
      const village = villages.find(v => v.id === biz.village_id)
      if (!village) return null

      // Random offset around village
      const angle = Math.random() * Math.PI * 2
      const radius = 0.4 + Math.random() * 0.3
      const x = village.coordinates.x + Math.cos(angle) * radius
      const z = village.coordinates.z + Math.sin(angle) * radius

      return { ...biz, x, z }
    }).filter(Boolean) as (typeof businesses[0] & { x: number, z: number })[]
  }, [])

  useEffect(() => {
    if (!meshRef.current) return

    // Set positions and colors
    businessData.forEach((data, i) => {
      tempObject.position.set(data.x, 0.25, data.z)
      tempObject.scale.set(1, 1, 1)
      tempObject.updateMatrix()
      meshRef.current!.setMatrixAt(i, tempObject.matrix)

      // Default color
      meshRef.current!.setColorAt(i, tempColor.set("#10B981")) // Green
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [businessData, tempObject, tempColor])

  // Handle hover effect
  useEffect(() => {
    if (!meshRef.current) return

    // Reset all colors (inefficient for many, but fine for 60)
    // Or just update the previous hovered one?
    // For simplicity, re-apply all or just update the specific one if we tracked previous.
    // Let's just update the hovered one.

    if (hoveredId !== null) {
      meshRef.current.setColorAt(hoveredId, tempColor.set("#D4AF37")) // Gold
    } else {
      // We need to restore the color of the *previously* hovered item.
      // Since we don't track it easily here without more state, let's just re-apply all colors or be lazy.
      // Re-applying all is safest.
      businessData.forEach((_, i) => {
        meshRef.current!.setColorAt(i, tempColor.set("#10B981"))
      })
    }

    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [hoveredId, businessData, tempColor])

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, businessData.length]}
        onPointerMove={(e) => {
          e.stopPropagation()
          if (e.instanceId !== undefined) setHoveredId(e.instanceId)
        }}
        onPointerOut={() => setHoveredId(null)}
        onClick={(e) => {
          e.stopPropagation()
          const biz = businessData[e.instanceId!]
          console.log("Clicked business:", biz.business_name)
          // Could trigger a modal here
        }}
      >
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial toneMapped={false} />
      </instancedMesh>

      {/* Tooltip for hovered business */}
      {hoveredId !== null && (
        <Html position={[businessData[hoveredId].x, 1, businessData[hoveredId].z]} center style={{ pointerEvents: 'none' }}>
           <div className="bg-black/80 text-white text-xs px-2 py-1 rounded border border-gold whitespace-nowrap">
             {businessData[hoveredId].business_name}
           </div>
        </Html>
      )}
    </group>
  )
}
