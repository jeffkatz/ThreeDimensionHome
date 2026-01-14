import { Landmark, GraduationCap, Store, Globe } from 'lucide-react'

export type FilterType = 'all' | 'history' | 'schools' | 'businesses'

interface FilterBarProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  const filters: { id: FilterType; label: string; icon: any }[] = [
    { id: 'all', label: 'Overview', icon: Globe },
    { id: 'history', label: 'Heritage', icon: Landmark },
    { id: 'schools', label: 'Education', icon: GraduationCap },
    { id: 'businesses', label: 'Commerce', icon: Store },
  ]

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
      <div className="flex bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-2xl">
        {filters.map((f) => {
          const Icon = f.icon
          const isActive = currentFilter === f.id
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                ${isActive ? 'bg-gold text-black font-bold' : 'text-white hover:bg-white/10'}
              `}
            >
              <Icon size={16} />
              <span className="text-sm">{f.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
