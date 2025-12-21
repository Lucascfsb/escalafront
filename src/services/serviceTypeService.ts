import { api } from './apiClient'

export interface ServiceType {
  id: string
  name: string
  description: string | null
  rank: string
  created_at: string
  updated_at: string
}

export interface CreateServiceTypeDTO {
  name: string
  description?: string
  rank: string
}

export interface UpdateServiceTypeDTO {
  name?: string
  description?: string
  rank?: string
}

export interface ServiceTypeWithMilitaries {
  serviceType: {
    id: string
    name: string
    rank: string
    description: string | null
  }
  eligibleMilitaries: Array<{
    id: string
    war_name: string
    rank: {
      id: string
      name: string
    }
    qualification: {
      id: string
      name: string
    }
  }>
}

class ServiceTypeService {
  private readonly basePath = '/serviceTypes'

  async getAll(name?: string): Promise<ServiceType[]> {
    const url = name ? `${this.basePath}?name=${encodeURIComponent(name)}` : this.basePath

    const response = await api.get<ServiceType[]>(url)
    return response.data
  }

  async getByIdWithMilitaries(id: string): Promise<ServiceTypeWithMilitaries> {
    const response = await api.get<ServiceTypeWithMilitaries>(
      `${this.basePath}/${id}/militaries`
    )
    return response.data
  }

  async create(data: CreateServiceTypeDTO): Promise<ServiceType> {
    const response = await api.post<ServiceType>(this.basePath, {
      name: data.name,
      description: data.description,
      rank: data.rank,
    })
    return response.data
  }

  async update(id: string, data: UpdateServiceTypeDTO): Promise<ServiceType> {
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

  async addMilitary(serviceTypeId: string, militaryId: string): Promise<void> {
    await api.post(`${this.basePath}/${serviceTypeId}/militaries`, {
      military_id: militaryId,
    })
  }

  async removeMilitary(serviceTypeId: string, militaryId: string): Promise<void> {
    await api.delete(`${this.basePath}/${serviceTypeId}/militaries/${militaryId}`)
  }
}

export const serviceTypeService = new ServiceTypeService()
