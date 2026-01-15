import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { Village } from '../types'

interface CameraControllerProps {
  selectedVillage: Village | null
}

export function CameraController({ selectedVillage }: CameraControllerProps) {
  const { controls } = useThree()
  const targetPos = useRef(new Vector3(0, 0, 0))
  const cameraPos = useRef(new Vector3(0, 10, 20))
  const isTransitioning = useRef(false)

  useEffect(() => {
    if (selectedVillage) {
      // Fly to village
      targetPos.current.set(
        selectedVillage.coordinates.x,
        0,
        selectedVillage.coordinates.z
      )
      // Position camera nicely above and to the side
      cameraPos.current.set(
        selectedVillage.coordinates.x + 8,
        8,
        selectedVillage.coordinates.z + 8
      )
      isTransitioning.current = true
    } else {
      // Reset to overview
      targetPos.current.set(0, 0, 0)
      cameraPos.current.set(0, 15, 25)
      isTransitioning.current = true
    }
  }, [selectedVillage])

  useFrame((state, delta) => {
    if (!isTransitioning.current) return

    const controlsImpl = controls as unknown as OrbitControlsImpl
    if (!controlsImpl) return

    // Lerp target
    const step = 2.5 * delta
    controlsImpl.target.lerp(targetPos.current, step)

    // Lerp camera position
    state.camera.position.lerp(cameraPos.current, step)

    controlsImpl.update()

    // Stop transitioning when close enough
    if (
      controlsImpl.target.distanceTo(targetPos.current) < 0.05 &&
      state.camera.position.distanceTo(cameraPos.current) < 0.05
    ) {
      isTransitioning.current = false
    }
  })

  return null
}
