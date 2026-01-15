import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Village } from '../types'

interface SearchBarProps {
  villages: Village[]
  onSelect: (village: Village) => void
}

export function SearchBar({ villages, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const filteredVillages = useMemo(() => {
    if (!query) return []
    return villages.filter(v => v.name.toLowerCase().includes(query.toLowerCase()))
  }, [query, villages])

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto w-full max-w-md px-4">
      <div className={`
        relative flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full
        transition-all duration-300 ${focused ? 'border-gold shadow-gold/20 shadow-lg' : ''}
      `}>
        <Search className="ml-4 text-white/50" size={18} />
        <input
          type="text"
          placeholder="Search villages..."
          className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-white/50 font-body text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
      </div>

      <AnimatePresence>
        {focused && query && filteredVillages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-4 right-4 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          >
            {filteredVillages.map((village) => (
              <button
                key={village.id}
                onClick={() => {
                  onSelect(village)
                  setQuery('') // Clear search on select? Or keep it? keeping it clean is better.
                }}
                className="w-full text-left px-4 py-3 text-white/80 hover:bg-gold/20 hover:text-gold transition-colors border-b border-white/5 last:border-0"
              >
                <span className="font-bold">{village.name}</span>
                <span className="text-xs text-white/40 ml-2 uppercase tracking-wide">Village</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
