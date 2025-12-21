export interface MilitaryFormData {
  name: string
  rank: string
  qualification: string
  date_of_entry: string
  service_types?: string[]
}

export interface SearchFormData {
  searchName: string
}

export type ViewMode = 'card' | 'list'
