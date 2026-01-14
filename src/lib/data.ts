import type { Village, Business, School } from '../types'

const VILLAGE_NAMES = [
  "Phokeng", "Luka", "Chaneng", "Kanana", "Tlaseng",
  "Thebenare", "Tsitsing", "Mafenya", "Rasimone", "Serule",
  "Diepkuil", "Robega", "Mamerotse", "Mosental", "Rankotea",
  "Maile", "Lefaragatlhe", "Bobuampya", "Tlhabane", "Freedom Park",
  "Meriting", "Boitekong", "Paardekraal", "Waterkloof", "Boshoek",
  "Rooikraal", "Buffelspoort", "Marikana", "Bapong" // Some might be neighbors
]

export const villages: Village[] = VILLAGE_NAMES.map((name, i) => {
  // Simple spiral distribution for visual separation
  const angle = i * 0.5 + Math.random() * 0.2
  const radius = 2 + (i / VILLAGE_NAMES.length) * 3.5 // Spread from center (2) to edge (5.5)
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  return {
    id: `vil_${i}`,
    name,
    coordinates: {
      x,
      z,
      lat: -25.0 + (z * 0.01), // Mock conversion
      lng: 27.0 + (x * 0.01)
    },
    history_text: `Historical context for ${name}. This village plays a significant role in the Royal Bafokeng Nation's heritage.`,
    chief_name: `Kgosi ${name} III`,
  }
})

export const businesses: Business[] = villages.flatMap((v) => [
  {
    id: `biz_${v.id}_1`,
    village_id: v.id,
    business_name: `${v.name} General Dealer`,
    category: "Retail",
    contact_details: "014 555 0001",
  },
  {
    id: `biz_${v.id}_2`,
    village_id: v.id,
    business_name: `${v.name} Transport Services`,
    category: "Logistics",
    contact_details: "014 555 0002",
  }
])

export const schools: School[] = villages.flatMap((v) => [
  {
    id: `sch_${v.id}_1`,
    village_id: v.id,
    school_name: `${v.name} Primary School`,
    type: "Primary",
    student_count: Math.floor(Math.random() * 500) + 200
  },
  {
    id: `sch_${v.id}_2`,
    village_id: v.id,
    school_name: `${v.name} Secondary`,
    type: "High",
    student_count: Math.floor(Math.random() * 800) + 300
  }
])
