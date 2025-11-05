import type { ServiceFormData, ServiceType } from '../pages/MilServicesPage/types'
import { api } from './apiClient'

class MilServiceService {
  private readonly basePath = '/serviceTypes'

  async getAll(name?: string): Promise<ServiceType[]> {
    const url = name ? `${this.basePath}?name=${encodeURIComponent(name)}` : this.basePath

    const response = await api.get<ServiceType[]>(url)
    return response.data
  }

  async getById(id: string): Promise<ServiceType> {
    const response = await api.get<ServiceType>(`${this.basePath}/${id}`)
    return response.data
  }

  async create(data: ServiceFormData): Promise<ServiceType> {
    const response = await api.post<ServiceType>(this.basePath, {
      name: data.name,
      description: data.description,
      rank: data.rank,
    })
    return response.data
  }

  async update(id: string, data: ServiceFormData): Promise<ServiceType> {
    const response = await api.put<ServiceType>(`${this.basePath}/${id}`, {
      name: data.name,
      description: data.description,
      rank: data.rank,
    })
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }
}

export const milServiceService = new MilServiceService()
