import axios from 'axios'
import { se } from 'date-fns/locale'
import { useCallback, useEffect, useState } from 'react'
import type { ServiceFormData, ServiceType } from '../pages/MilServicesPage/types'
import { milServiceService } from '../services/milServiceServices'
import { useToast } from './toast'

export const useServices = (searchTerm: string) => {
  const { addToast } = useToast()
  const [services, setServices] = useState<ServiceType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      const data = await milServiceService.getAll(searchTerm || undefined)
      setServices(data)
      setError(null)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const message = `Nenhum serviço encontrado ${searchTerm ? `com o título "${searchTerm}"` : ''}.`
        setError(message)
        addToast({
          type: 'error',
          title: 'Erro ao Carregar',
          description: message,
        })
      } else {
        setError('Erro ao carregar serviços. Tente novamente.')
        addToast({
          type: 'error',
          title: 'Erro de Conexão',
          description: 'Não foi possível carregar os dados dos serviços.',
        })
      }
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, addToast])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const createService = useCallback(
    async (data: ServiceFormData) => {
      setIsLoading(true)
      try {
        await milServiceService.create(data)
        addToast({
          type: 'success',
          title: 'Serviço Cadastrado',
          description: 'Novo serviço cadastrado com sucesso!',
        })
        await fetchServices()
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao cadastrar serviço',
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, fetchServices]
  )

  const updateService = useCallback(
    async (id: string, data: ServiceFormData) => {
      setIsLoading(true)
      try {
        await milServiceService.update(id, data)
        addToast({
          type: 'success',
          title: 'Serviço Atualizado',
          description: 'Os dados do serviço foram atualizados com sucesso!',
        })
        await fetchServices()
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao atualizar serviço',
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, fetchServices]
  )

  const deleteService = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        await milServiceService.delete(id)
        addToast({
          type: 'success',
          title: 'Serviço Deletado',
          description: 'Serviço removido com sucesso!',
        })
        await fetchServices()
      } catch (err) {
        setError('Erro ao deletar serviço.')
        addToast({
          type: 'error',
          title: 'Erro ao Deletar',
          description: 'Não foi possível deletar o serviço. Tente novamente.',
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, fetchServices]
  )

  return {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService,
  }
}
