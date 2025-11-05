import axios from 'axios'
import { endOfWeek } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../hooks/toast'
import type { Military, ServiceRendered, ServiceType } from '../pages/ForecastPage/types'
import { forecastService } from '../services/forecastService'

export const useForecastData = (currentWeekStart: Date) => {
  const { addToast } = useToast()

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [militaries, setMilitaries] = useState<Military[]>([])
  const [servicesRendered, setServicesRendered] = useState<ServiceRendered[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceTypes = useCallback(async () => {
    try {
      const data = await forecastService.getServiceTypes()
      setServiceTypes(data)
    } catch (err) {
      setError('Erro ao carregar tipos de serviço.')
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Não foi possível carregar os tipos de serviço.',
      })
    }
  }, [addToast])

  const fetchMilitaries = useCallback(async () => {
    try {
      const data = await forecastService.getMilitaries()
      setMilitaries(data)
    } catch (err) {
      setError('Erro ao carregar militares.')
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Não foi possível carregar a lista de militares.',
      })
    }
  }, [addToast])

  const fetchServicesRendered = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const endDate = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
      const data = await forecastService.getServicesRendered(currentWeekStart, endDate)
      setServicesRendered(data)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Nenhum serviço encontrado para esta semana.')
        setServicesRendered([])
      } else {
        setError('Erro ao carregar previsão de escala.')
        addToast({
          type: 'error',
          title: 'Erro',
          description: 'Não foi possível carregar a previsão de escala.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [currentWeekStart, addToast])

  useEffect(() => {
    fetchServiceTypes()
    fetchMilitaries()
  }, [fetchServiceTypes, fetchMilitaries])

  useEffect(() => {
    fetchServicesRendered()
  }, [fetchServicesRendered])

  return {
    serviceTypes,
    militaries,
    servicesRendered,
    setServicesRendered,
    isLoading,
    error,
  }
}
