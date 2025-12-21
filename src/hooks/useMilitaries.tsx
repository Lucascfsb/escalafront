import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import type { Military } from '../@types/types'
import type { MilitaryFormData } from '../pages/MilitariesPage/types'
import { militaryService } from '../services/militaryService'
import { serviceTypeService } from '../services/serviceTypeService'
import { useToast } from './toast'

export interface ServiceType {
  id: string
  name: string
  description: string | null
}

export const useMilitaries = (searchTerm = '') => {
  const [militaries, setMilitaries] = useState<Military[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingServiceTypes, setIsLoadingServiceTypes] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addToast } = useToast()

  const fetchServiceTypes = useCallback(async () => {
    setIsLoadingServiceTypes(true)
    try {
      const data = await serviceTypeService.getAll()
      setServiceTypes(data)
    } catch (err) {
      const is404 = axios.isAxiosError(err) && err.response?.status === 404

      if (is404) {
        setServiceTypes([])
      } else {
        addToast({
          type: 'error',
          title: 'Erro ao carregar tipos de serviço',
          description: 'Não foi possível carregar os tipos de serviço disponíveis.',
        })
        setServiceTypes([])
      }
    } finally {
      setIsLoadingServiceTypes(false)
    }
  }, [addToast])

  const fetchMilitaries = useCallback(
    async (name?: string) => {
      setError(null)
      setIsLoading(true)

      try {
        const data = await militaryService.getAll(name)
        setMilitaries(data)
      } catch (err) {
        const isNotFound = axios.isAxiosError(err) && err.response?.status === 404

        const errorMessage = isNotFound
          ? `Nenhum militar encontrado ${name ? `com o nome "${name}"` : ''}.`
          : 'Erro ao carregar militares. Tente novamente.'

        setError(errorMessage)
        setMilitaries([])

        addToast({
          type: 'error',
          title: isNotFound ? 'Erro ao Carregar' : 'Erro de Conexão',
          description: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  const createMilitary = useCallback(
    async (data: MilitaryFormData) => {
      setIsLoading(true)

      try {
        await militaryService.create(data)

        addToast({
          type: 'success',
          title: 'Militar Cadastrado',
          description: 'Novo militar cadastrado com sucesso!',
        })

        await fetchMilitaries(searchTerm || undefined)
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao cadastrar',
          description: 'Ocorreu um erro. Tente novamente.',
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, fetchMilitaries, searchTerm]
  )

  const updateMilitary = useCallback(
    async (id: string, data: MilitaryFormData) => {
      setIsLoading(true)

      try {
        await militaryService.update(id, data)

        addToast({
          type: 'success',
          title: 'Militar Atualizado',
          description: 'Dados atualizados com sucesso!',
        })

        await fetchMilitaries(searchTerm || undefined)
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao atualizar',
          description: 'Ocorreu um erro. Tente novamente.',
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, fetchMilitaries, searchTerm]
  )

  const deleteMilitary = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await militaryService.delete(id)

        addToast({
          type: 'success',
          title: 'Militar Deletado',
          description: 'Militar removido com sucesso!',
        })

        await fetchMilitaries(searchTerm || undefined)
      } catch (err) {
        setError('Erro ao deletar militar.')

        addToast({
          type: 'error',
          title: 'Erro ao Deletar',
          description: 'Não foi possível deletar o militar.',
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, fetchMilitaries, searchTerm]
  )

  useEffect(() => {
    fetchMilitaries(searchTerm || undefined)
    fetchServiceTypes()
  }, [fetchMilitaries, fetchServiceTypes, searchTerm])

  return {
    militaries,
    serviceTypes,
    isLoading,
    isLoadingServiceTypes,
    error,
    createMilitary,
    updateMilitary,
    deleteMilitary,
  }
}
