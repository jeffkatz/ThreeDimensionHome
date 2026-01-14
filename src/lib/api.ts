import { supabase } from './supabase'
import { villages as mockVillages } from './data'
import type { Village, News } from '../types'

export const api = {
  async getVillages(): Promise<Village[]> {
    if (supabase) {
      const { data, error } = await supabase.from('villages').select('*')
      if (!error && data) {
        return data as any as Village[]
      }
    }
    // Fallback to mock
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockVillages), 500) // Simulate network delay
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
