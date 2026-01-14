import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { FloatingIsland } from './FloatingIsland'
import { VillageMarkers } from './VillageMarkers'
import { BusinessMarkers } from './BusinessMarkers'
import { Suspense } from 'react'
import type { Village } from '../types'

interface SceneProps {
  villages: Village[]
  filter: string
  onVillageSelect: (village: Village) => void
}

export function Scene({ villages, filter, onVillageSelect }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 20], fov: 45 }}
      className="w-full h-full"
      gl={{ antialias: false }} // Performance for post-processing
    >
      <Suspense fallback={null}>
        <group>
          {/* Atmospheric Lighting */}
          <ambientLight intensity={0.5} color="#ffffff" />
          <spotLight
            position={[10, 20, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={2048}
            color="#D4AF37"
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1A472A" />

          {/* Environment */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          {/* Main Content */}
          <FloatingIsland />

          <VillageMarkers
            villages={villages}
            filter={filter}
            onSelect={onVillageSelect}
          />

          {(filter === 'businesses' || filter === 'all') && <BusinessMarkers />}

          {/* Effects */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              intensity={2}
            />
          </EffectComposer>

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2.2}
            dampingFactor={0.05}
          />
        </group>
      </Suspense>
    </Canvas>
  )
}
