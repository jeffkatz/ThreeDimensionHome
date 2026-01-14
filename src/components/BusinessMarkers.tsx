import { useRef, useMemo, useEffect } from 'react'
import { InstancedMesh, Object3D } from 'three'
import { businesses, villages } from '../lib/data'

export function BusinessMarkers() {
  const meshRef = useRef<InstancedMesh>(null)
  const tempObject = useMemo(() => new Object3D(), [])

  // Create business positions around their villages
  const businessData = useMemo(() => {
    return businesses.map((biz) => {
      const village = villages.find(v => v.id === biz.village_id)
      if (!village) return null

      // Random offset around village
      const angle = Math.random() * Math.PI * 2
      const radius = 0.3 + Math.random() * 0.2
      const x = village.coordinates.x + Math.cos(angle) * radius
      const z = village.coordinates.z + Math.sin(angle) * radius

      return { x, z }
    }).filter(Boolean) as { x: number, z: number }[]
  }, [])

  useEffect(() => {
    if (!meshRef.current) return

    // Set positions
    businessData.forEach((pos, i) => {
      tempObject.position.set(pos.x, 0.1, pos.z)
      tempObject.scale.set(0.5, 0.5, 0.5)
      tempObject.updateMatrix()
      meshRef.current!.setMatrixAt(i, tempObject.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [businessData, tempObject])

  /*
  useFrame((state) => {
    if (!meshRef.current) return
    // Animate instances (optional, tricky with simple matrix updates, so we just animate the group or leave static)
    // For a simple "bob", we'd need to update all matrices every frame which kills performance benefit partially.
    // So we'll keep them static or animate the material.
  })
  */

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, businessData.length]}
    >
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={2} />
    </instancedMesh>
  )
}
