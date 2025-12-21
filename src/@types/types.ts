export interface BaseItem {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Military extends BaseItem {
  name: string
  rank: string
  qualification: string
  date_of_entry: string
  eligibleServiceTypes?: Array<{
    id: string
    name: string
    description: string | null
  }>
}

export interface Service extends BaseItem {
  description: string
  rank: string
}

export interface User {
  id: string
  avatar_url: string
  username: string
  email: string
  role: 'admin' | 'usuário' | 'consulta'
}
