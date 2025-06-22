export interface BaseItem {
  id: string
  name: string
  created_at: string
  update_at: string
}

export interface Military extends BaseItem {
  rank: string
  qualification: string
  date_of_entry: string
}

export interface Service extends BaseItem {
  description: string
}
