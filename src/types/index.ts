export interface Coordinates {
  x: number
  z: number
  lat: number
  lng: number
}

export interface Village {
  id: string
  name: string
  coordinates: Coordinates
  history_text: string
  chief_name: string
  created_at?: string
}

export interface Business {
  id: string
  village_id: string
  business_name: string
  category: string
  contact_details: string
  website_url?: string
}

export interface School {
  id: string
  village_id: string
  school_name: string
  type: 'Primary' | 'High' | 'Secondary' | 'Combined'
  student_count: number
}

export interface News {
  id: string
  title: string
  content: string
  image_url?: string
  category: 'Culture' | 'News' | 'Alerts'
  created_at: string
}
