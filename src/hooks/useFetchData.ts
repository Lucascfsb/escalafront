import axios from 'axios'
import { useCallback, useState } from 'react'
import api from '../services/apiClient'
import { useToast } from './toast'

interface UseFetchDataOptions {
  notFoundMessage?: string
  genericErrorMessage?: string
  genericErrorToastTitle?: string
}

interface UseFetchDataResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  dataLoaded: boolean
  fetchData: (queryParam?: string) => Promise<void>
  setData: React.Dispatch<React.SetStateAction<T | null>>
  setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

export function useFetchData<T>(
  baseUrl: string,
  options?: UseFetchDataOptions
): UseFetchDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const { addToast } = useToast()

  const fetchData = useCallback(
    async (queryParam?: string) => {
      setError(null)
      setIsLoading(true)
      setDataLoaded(false)

      try {
        const params = queryParam ? { name: queryParam } : {}
        const response = await api.get<T>(baseUrl, { params })

        setData(response.data)
        setDataLoaded(true)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            const notFoundMsg =
              options?.notFoundMessage ||
              `Nenhum item encontrado${queryParam ? ` com o nome "${queryParam}"` : ''}.`

            setError(notFoundMsg)
            addToast({
              type: 'error',
              title: 'Erro ao Carregar',
              description: notFoundMsg,
            })
          } else {
            const genericErrorMsg =
              options?.genericErrorMessage || 'Erro ao carregar dados. Tente novamente.'

            addToast({
              type: 'error',
              title: options?.genericErrorToastTitle || 'Erro de Conexão',
              description: genericErrorMsg,
            })
            setError(genericErrorMsg)
          }
        } else {
          const unknownError = 'Ocorreu um erro desconhecido'
          setError(unknownError)
          addToast({
            type: 'error',
            title: 'Erro',
            description: unknownError,
          })
        }

        setData(null)
        setDataLoaded(false)
      } finally {
        setIsLoading(false)
      }
    },
    [baseUrl, addToast, options]
  )

  return {
    data,
    isLoading,
    error,
    dataLoaded,
    fetchData,
    setData,
    setDataLoaded,
  }
}
