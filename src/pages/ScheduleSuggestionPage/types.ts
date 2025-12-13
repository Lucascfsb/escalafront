export interface ServiceType {
  id: string
  name: string
  description?: string
}

export interface ServiceRendered {
  id: string
  military_id: string | null
  military: Military | null
  service_types_id: string
  serviceType: ServiceType
  service_date: string
  created_at: string
  updated_at: string
}

export interface Military {
  id: string
  name: string
  rank: string
  qualification: string
  date_of_entry: string
  created_at: string
  update_at: string
}

export interface MilitarySuggestion {
  military: Military
  lastServiceDate: string | null
  daysSinceLastService: number
  totalServicesInThisType: number
}
