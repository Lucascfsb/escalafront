import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiAlignJustify, FiBookmark, FiUser } from 'react-icons/fi'
import * as Yup from 'yup'

import { useToast } from '../../hooks/toast'
import { api } from '../../services/apiClient'

import { Button } from '../../components/Button'
import { ServiceDisplay } from '../../components/InfoDisplay/Display/ServiceDisplay'
import { Input } from '../../components/Input'
import { Layout } from '../../components/Layout'
import { Pagination } from '../../components/Pagination'
import { SelectSearch } from '../../components/SelectSearch'

import { MainContent } from './styles'

interface ServiceType {
  id: string
  name: string
  description: string
  rank: string
  created_at: string
  update_at: string
}

export interface ServiceTypeFormData {
  name: string
  description: string
  rank: string
}

interface SearchServiceData {
  searchName: string
}

const serviceTypeSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  description: Yup.string().default(''),
  rank: Yup.string().required('Selecione uma patente'),
})

const searchServiceSchema = Yup.object().shape({
  searchName: Yup.string().default(''),
})

const MilServicesPage: React.FC = () => {
  const { addToast } = useToast()

  const [allServicesType, setAllServicesType] = useState<ServiceType[]>([])
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('')
  const [editingServiceTypesId, setEditingServiceTypesId] = useState<string | null>(null)
  const [servicesTypesLoaded, setServicesTypesLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceTypeFormData>({
    resolver: yupResolver(serviceTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      rank: 'Selecione uma Opção',
    },
  })

  const {
    control: searchControl,
    handleSubmit: handleSearchSubmit,
    reset: resetSearchForm,
    formState: { errors: searchErrors },
  } = useForm<SearchServiceData>({
    resolver: yupResolver(searchServiceSchema),
  })

  const totalPages = useMemo(() => {
    return Math.ceil(allServicesType.length / itemsPerPage)
  }, [allServicesType])

  const fetchServiceType = useCallback(
    async (name?: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const url = name
          ? `/serviceTypes?name=${encodeURIComponent(name)}`
          : '/serviceTypes'
        const response = await api.get<ServiceType[]>(url)
        setAllServicesType(response.data)
        setServicesTypesLoaded(true)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(`Nenhum serviço encontrado ${name ? `com o nome "${name}"` : ''}.`)
        } else {
          setError('Erro ao carregar serviços. Tente novamente.')
        }
        addToast({
          type: 'error',
          title: 'Erro de Conexão',
          description: 'Não foi possível carregar os dados dos serviços.',
        })
        setAllServicesType([])
        setServicesTypesLoaded(false)
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  const reloadDataAndResetPage = useCallback(async () => {
    setCurrentPage(1)
    await fetchServiceType(currentSearchTerm || undefined)
  }, [currentSearchTerm, fetchServiceType])

  useEffect(() => {
    fetchServiceType()
  }, [fetchServiceType])

  const displayedServicesTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allServicesType.slice(startIndex, endIndex)
  }, [allServicesType, currentPage])

  const handleSubmitServiceType = useCallback(
    async (data: ServiceTypeFormData) => {
      setIsLoading(true)
      setError(null)
      try {
        if (editingServiceTypesId) {
          await api.put<ServiceType>(`/serviceTypes/${editingServiceTypesId}`, {
            ...data,
          })
          addToast({
            type: 'success',
            title: 'Tipo de Serviço Atualizado',
            description: 'Os dados do tipo de serviço foram atualizados com sucesso!',
          })
        } else {
          await api.post('/serviceTypes', {
            ...data,
            created_at: new Date().toISOString(),
            update_at: new Date().toISOString(),
          })
          addToast({
            type: 'success',
            title: 'Tipo de Serviço Cadastrado',
            description: 'Novo tipo de serviço cadastrado com sucesso!',
          })
        }
        setEditingServiceTypesId(null)
        reset()
        await reloadDataAndResetPage()
      } catch (err) {
        addToast({
          type: 'error',
          title: `Erro ao ${editingServiceTypesId ? 'atualizar' : 'cadastrar'} tipo de serviço`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [editingServiceTypesId, addToast, reloadDataAndResetPage, reset]
  )

  const handleSerchServiceType = useCallback(
    async (data: SearchServiceData) => {
      const { searchName } = data
      setCurrentSearchTerm(searchName)
      await fetchServiceType(searchName)
    },
    [fetchServiceType]
  )

  const handleEditServiceType = useCallback(
    (serviceType: ServiceType) => {
      setEditingServiceTypesId(serviceType.id)
      reset(serviceType)
    },
    [reset]
  )

  const handleListAllServiceTypes = useCallback(async () => {
    setCurrentSearchTerm('')
    resetSearchForm()
    await fetchServiceType()
  }, [fetchServiceType, resetSearchForm])

  const handleDeleteServiceType = useCallback(
    async (id: string) => {
      if (!window.confirm('Tem certeza que deseja deletar este tipo de serviço?')) {
        return
      }
      setError(null)
      setIsLoading(true)
      try {
        await api.delete(`/serviceTypes/${id}`)
        addToast({
          type: 'success',
          title: 'Tipo de Serviço Deletado',
          description: 'Tipo de serviço removido com sucesso!',
        })
        await reloadDataAndResetPage()
      } catch (err) {
        setError('Erro ao deletar tipo de serviço.')
        addToast({
          type: 'error',
          title: 'Erro ao Deletar',
          description: 'Não foi possível deletar o tipo de serviço. Tente novamente.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, reloadDataAndResetPage]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return
      setCurrentPage(page)
    },
    [currentPage, totalPages]
  )

  return (
    <Layout>
      <MainContent>
        {error && <p>{error}</p>}
        {isLoading && <p>Carregando...</p>}
        <h2>Buscar Serviço por Nome</h2>
        <form onSubmit={handleSearchSubmit(handleSerchServiceType)}>
          <Controller
            name="searchName"
            control={searchControl}
            render={({ field }) => (
              <Input
                icon={FiUser}
                type="text"
                placeholder="Nome do Serviço para busca."
                {...field}
                error={searchErrors.searchName?.message}
              />
            )}
          />
          <Button type="submit">Buscar por Nome</Button>
          <Button onClick={handleListAllServiceTypes} disabled={isLoading} variant="info">
            Listar Todos os Serviços
          </Button>
        </form>

        {servicesTypesLoaded && (
          <>
            <h3>
              {currentSearchTerm
                ? `Serviços Encontrados (${allServicesType.length} total)`
                : `Todos os Serviços (${allServicesType.length} total)`}
            </h3>
            {allServicesType.length > 0 ? (
              <div>
                {displayedServicesTypes.map(serviceType => (
                  <ServiceDisplay
                    key={serviceType.id}
                    service={serviceType}
                    onEdit={handleEditServiceType}
                    onDelete={handleDeleteServiceType}
                  />
                ))}
              </div>
            ) : (
              <p>Nenhum serviço encontrado</p>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </>
        )}

        <h2>{editingServiceTypesId ? 'Atualizar Serviço' : 'Cadastrar Novo Serviço'}</h2>
        <form onSubmit={handleSubmit(handleSubmitServiceType)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                icon={FiUser}
                placeholder="Nome do Serviço"
                {...field}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                icon={FiAlignJustify}
                placeholder="Descrição do Serviço"
                {...field}
                error={errors.description?.message}
              />
            )}
          />
          <Controller
            name="rank"
            control={control}
            render={({ field }) => (
              <SelectSearch
                icon={FiBookmark}
                options={[
                  { value: 'Sd', label: 'Sd' },
                  { value: 'Cb', label: 'Cb' },
                  { value: 'Serviço de Sgt', label: 'Serviço de Sgt' },
                  {
                    value: 'Serviço de Oficial Subalterno',
                    label: 'Serviço de Oficial Subalterno',
                  },
                  {
                    value: 'Serviço de Oficial Superior',
                    label: 'Serviço de Oficial Superior',
                  },
                ]}
                {...field}
              />
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {editingServiceTypesId ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
          </Button>
          <Button
            type="button"
            onClick={() => {
              setEditingServiceTypesId(null)
              reset()
            }}
            variant="danger"
            disabled={isLoading}
          >
            Cancelar Edição
          </Button>
        </form>
      </MainContent>
    </Layout>
  )
}

export { MilServicesPage }
