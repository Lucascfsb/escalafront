import type { Military } from '../@types/types'
import type { MilitaryFormData } from '../pages/MilitariesPage/types'
import { api } from './apiClient'

class MilitaryService {
  private readonly basePath = '/militaries'

  async getAll(name?: string): Promise<Military[]> {
    const url = name ? `${this.basePath}?name=${encodeURIComponent(name)}` : this.basePath

    const response = await api.get<Military[]>(url)
    return response.data
  }

  async getById(id: string): Promise<Military> {
    const response = await api.get<Military>(`${this.basePath}/${id}`)
    return response.data
  }

  async create(data: MilitaryFormData): Promise<Military> {
    const response = await api.post<Military>(this.basePath, {
      name: data.name,
      rank: data.rank,
      qualification: data.qualification,
      date_of_entry: data.date_of_entry,
      service_types: data.service_types,
    })
    return response.data
  }

  async update(id: string, data: MilitaryFormData): Promise<Military> {
    const response = await api.put<Military>(`${this.basePath}/${id}`, {
      name: data.name,
      rank: data.rank,
      qualification: data.qualification,
      date_of_entry: data.date_of_entry,
      service_types: data.service_types,
    })
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }
}

export const militaryService = new MilitaryService()
