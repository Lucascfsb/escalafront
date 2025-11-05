import { format } from 'date-fns'
import type { Military, ServiceRendered, ServiceType } from '../pages/ForecastPage/types'
import { api } from './apiClient'

export interface CreateServiceRendered {
  military_id: string
  service_types_id: string
  service_date: string
}

export interface UpdateServiceRendered {
  military_id: string
}

class ForecastService {
  async getServiceTypes(): Promise<ServiceType[]> {
    const response = await api.get<ServiceType[]>('/serviceTypes')
    return response.data.sort((a, b) => a.name.localeCompare(b.name))
  }

  async getMilitaries(): Promise<Military[]> {
    const response = await api.get<Military[]>('/militaries')
    return response.data
  }

  async getServicesRendered(startDate: Date, endDate: Date): Promise<ServiceRendered[]> {
    const start = format(startDate, 'yyyy-MM-dd')
    const end = format(endDate, 'yyyy-MM-dd')

    const response = await api.get<ServiceRendered[]>(
      `/serviceRendered?startDate=${start}&endDate=${end}`
    )
    return response.data
  }

  async createServiceRendered(data: CreateServiceRendered): Promise<ServiceRendered> {
    const response = await api.post<ServiceRendered>('/serviceRendered', data)
    return response.data
  }

  async updateServiceRendered(
    id: string,
    data: UpdateServiceRendered
  ): Promise<ServiceRendered> {
    const response = await api.put<ServiceRendered>(`/serviceRendered/${id}`, data)
    return response.data
  }

  async deleteServiceRendered(id: string): Promise<void> {
    await api.delete(`/serviceRendered/${id}`)
  }
}

export const forecastService = new ForecastService()
