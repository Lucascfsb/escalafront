import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import type { Military, MilitaryFormData } from '../pages/MilitariesPage/types'
import { militaryService } from '../services/militaryService'
import { useToast } from './toast'

export const useMilitaries = (searchTerm = '') => {
  const [militaries, setMilitaries] = useState<Military[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addToast } = useToast()

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
  }, [fetchMilitaries, searchTerm])

  return {
    militaries,
    isLoading,
    error,
    createMilitary,
    updateMilitary,
    deleteMilitary,
  }
}
