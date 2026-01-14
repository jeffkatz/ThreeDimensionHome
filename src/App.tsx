import { useState, useEffect } from 'react'
import { Scene } from './components/Scene'
import { InfoModal } from './components/InfoModal'
import { NewsTicker } from './components/NewsTicker'
import { FilterBar } from './components/FilterBar'
import type { FilterType } from './components/FilterBar'
import { api } from './lib/api'
import type { Village } from './types'

function App() {
  const [villages, setVillages] = useState<Village[]>([])
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getVillages().then(data => {
      setVillages(data)
      setLoading(false)
    })
  }, [])

  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village)
  }

  return (
    <div className="h-screen w-screen bg-charcoal relative">
      <div className="absolute inset-0 z-0">
        <Scene
          villages={villages}
          filter={filter}
          onVillageSelect={handleVillageSelect}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-black/80 text-gold px-6 py-3 rounded-full backdrop-blur font-mono animate-pulse">
            Loading Lefatshe...
          </div>
        </div>
      )}

      {/* Overlay UI Layer */}
      <div className="absolute top-0 left-0 p-8 pointer-events-none z-10">
        <h1 className="text-4xl text-gold font-heading drop-shadow-lg">Lefatshe la Bafokeng</h1>
        <p className="text-white/70 font-mono text-sm tracking-widest uppercase mt-2">Royal Bafokeng Nation</p>
      </div>

      <NewsTicker />

      <FilterBar currentFilter={filter} onFilterChange={setFilter} />

      {/* Info Modal */}
      <InfoModal
        village={selectedVillage}
        onClose={() => setSelectedVillage(null)}
      />
    </div>
  )
}

export default App
