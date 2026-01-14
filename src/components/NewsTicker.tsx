import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { api } from '../lib/api'
import type { News } from '../types'

export function NewsTicker() {
  const [news, setNews] = useState<News[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    api.getNews().then(setNews)
  }, [])

  useEffect(() => {
    if (news.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [news])

  if (news.length === 0) return null

  const currentNews = news[currentIndex]

  return (
    <div className="absolute bottom-8 right-8 z-10 pointer-events-auto">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 w-80 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-gold text-xs font-bold uppercase tracking-wider">
          <Bell size={12} />
          <span>Community Updates</span>
        </div>

        <div className="h-16 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNews.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <h4 className="font-bold text-sm text-white line-clamp-1">{currentNews.title}</h4>
              <p className="text-xs text-white/60 line-clamp-2 mt-1">{currentNews.content}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-1 mt-2">
          {news.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${idx === currentIndex ? 'bg-gold' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
