export interface ServiceType {
  id: string
  name: string
  description: string
  rank: string
  created_at: string
  update_at: string
  updated_at: string | Date
}

export type ServiceFormData = {
  name: string
  description: string
  rank: string
}

export interface SearchServiceData {
  searchName: string
}

export type ViewMode = 'card' | 'list'
