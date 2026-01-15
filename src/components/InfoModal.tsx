import { motion, AnimatePresence } from 'framer-motion'
import { X, GraduationCap, Store, BookOpen, MapPin, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Village, Business, School } from '../types'
import { api } from '../lib/api'

interface InfoModalProps {
  village: Village | null
  onClose: () => void
}

export function InfoModal({ village, onClose }: InfoModalProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (village) {
      setLoading(true)
      api.getVillageDetails(village.id).then(({ businesses, schools }) => {
        setBusinesses(businesses)
        setSchools(schools)
        setLoading(false)
      })
    } else {
      setBusinesses([])
      setSchools([])
    }
  }, [village])

  if (!village) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-md h-[90vh] pointer-events-auto"
        >
          <div className="h-full flex flex-col bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white">

            {/* Header */}
            <div className="relative p-8 pb-4">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest mb-4">
                <MapPin size={12} />
                Royal Bafokeng Village
              </div>
              <h2 className="text-4xl font-heading text-gold mb-1">{village.name}</h2>
              <p className="text-white/60 font-mono text-sm">{village.chief_name}</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-8 custom-scrollbar">

              {/* History Section */}
              <section>
                <div className="flex items-center gap-2 text-gold font-bold mb-3 border-b border-white/10 pb-2">
                  <BookOpen size={18} />
                  <h3>Historical Context</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/80 font-body">
                  {village.history_text}
                </p>
              </section>

              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-gold" size={32} />
                </div>
              ) : (
                <>
                  {/* Education Section */}
                  <section>
                    <div className="flex items-center gap-2 text-gold font-bold mb-3 border-b border-white/10 pb-2">
                      <GraduationCap size={18} />
                      <h3>Education</h3>
                    </div>
                    <div className="space-y-3">
                      {schools.map(school => (
                        <div key={school.id} className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-gold/30 transition-colors">
                          <h4 className="font-bold text-sm">{school.school_name}</h4>
                          <div className="flex justify-between text-xs text-white/50 mt-1">
                            <span>{school.type}</span>
                            <span>{school.student_count} Students</span>
                          </div>
                        </div>
                      ))}
                      {schools.length === 0 && <p className="text-xs text-white/40 italic">No schools listed.</p>}
                    </div>
                  </section>

                  {/* Economy Section */}
                  <section>
                    <div className="flex items-center gap-2 text-gold font-bold mb-3 border-b border-white/10 pb-2">
                      <Store size={18} />
                      <h3>Local Economy</h3>
                    </div>
                    <div className="space-y-3">
                      {businesses.map(biz => (
                        <div key={biz.id} className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-gold/30 transition-colors">
                          <h4 className="font-bold text-sm">{biz.business_name}</h4>
                          <div className="flex flex-col gap-1 text-xs text-white/50 mt-1">
                            <span className="text-gold/80">{biz.category}</span>
                            <span>{biz.contact_details}</span>
                          </div>
                        </div>
                      ))}
                      {businesses.length === 0 && <p className="text-xs text-white/40 italic">No businesses listed.</p>}
                    </div>
                  </section>
                </>
              )}

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <button className="w-full py-3 bg-gold text-black font-bold rounded-xl hover:bg-white transition-colors">
                View Full Profile
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
