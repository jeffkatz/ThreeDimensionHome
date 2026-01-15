import { supabase } from './supabase'
import { villages as mockVillages, businesses as mockBusinesses, schools as mockSchools } from './data'
import type { Village, News, Business, School } from '../types'

// Define the shape of data as it comes from Supabase (assuming JSON coordinates)
interface DBVillage {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  history_text: string
  chief_name: string
  created_at: string
}

export const api = {
  async getVillages(): Promise<Village[]> {
    if (supabase) {
      const { data, error } = await supabase.from('villages').select('*')
      if (!error && data) {
        // Map DB data to App data
        return (data as unknown as DBVillage[]).map(v => ({
          ...v,
          coordinates: {
            lat: v.coordinates.lat,
            lng: v.coordinates.lng,
            // Convert Lat/Lng to X/Z for 3D world (approximate projection)
            // lat = -25.0 + (z * 0.01)  => z = (lat + 25.0) / 0.01
            // lng = 27.0 + (x * 0.01)   => x = (lng - 27.0) / 0.01
            z: (v.coordinates.lat + 25.0) / 0.01,
            x: (v.coordinates.lng - 27.0) / 0.01
          }
        }))
      }
    }
    // Fallback to mock
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVillages), 500) // Simulate network delay
    })
  },

  async getVillageDetails(villageId: string): Promise<{ businesses: Business[], schools: School[] }> {
    if (supabase) {
      const [bizRes, schoolRes] = await Promise.all([
        supabase.from('businesses').select('*').eq('village_id', villageId),
        supabase.from('schools').select('*').eq('village_id', villageId)
      ])

      if (!bizRes.error && !schoolRes.error) {
        return {
          businesses: bizRes.data as Business[],
          schools: schoolRes.data as School[]
        }
      }
    }

    // Fallback to mock
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          businesses: mockBusinesses.filter(b => b.village_id === villageId),
          schools: mockSchools.filter(s => s.village_id === villageId)
        })
      }, 300)
    })
  },

  async getNews(): Promise<News[]> {
    if (supabase) {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false })
      if (!error && data) return data as News[]
    }
    return [
      {
        id: '1',
        title: 'Royal Bafokeng Nation Announces New Education Initiative',
        content: 'A new scholarship program has been launched...',
        category: 'News',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Upcoming Cultural Festival in Phokeng',
        content: 'Join us for the annual celebration of heritage...',
        category: 'Culture',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        title: 'Weather Alert: Heavy Rains Expected',
        content: 'Residents are advised to take precautions...',
        category: 'Alerts',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  }
}
