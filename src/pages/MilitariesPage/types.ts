export interface Military {
  id: string
  name: string
  rank: string
  qualification: string
  date_of_entry: string
  created_at: string
  update_at: string
}

export interface MilitaryFormData {
  name: string
  rank: string
  qualification: string
  date_of_entry: string
}

export interface SearchFormData {
  searchName: string
}

export type ViewMode = 'card' | 'list'

