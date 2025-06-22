import axios from 'axios'
import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FiAlignJustify, FiUser } from 'react-icons/fi'
import * as Yup from 'yup'
import { useToast } from '../../hooks/toast'
import api from '../../services/apiClient'
import getValidationErrors from '../../utils/getValidationErrors'

import type { FormHandles } from '@unform/core'
import { Form } from '@unform/web'

import Button from '../../components/Button'
import Input from '../../components/Input'

import ServiceDisplay from '../../components/InfoDisplay/Display/ServiceDisplay'

import Layout from '../../components/Layout'
import Pagination from '../../components/Pagination'
import { MainContent } from './styles'

interface ServiceType {
  id: string
  name: string
  description: string
  created_at: string
  update_at: string
}

interface ServiceTypeFormData {
  name: string
  description: string
}

interface searchService {
  searchName: string
}

const MilServices: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const formRefSearch = useRef<FormHandles>(null)

  const { addToast } = useToast()

  const [newServiceTypeData, setNewServiceTypeData] = useState<ServiceTypeFormData>({
    name: '',
    description: '',
  })

  const [allServicesType, setAllServicesType] = useState<ServiceType[]>([])
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('')
  const [editingServiceTypesId, setEditingServiceTypesId] = useState<string | null>(null)
  const [servicesTypesLoaded, setServicesTypesLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const totalPages = useMemo(() => {
    return Math.ceil(allServicesType.length / itemsPerPage)
  }, [allServicesType])

  const fetchServiceType = useCallback(
    async (name?: string) => {
      setError(null)
      setIsLoading(true)
      try {
        let url = '/serviceTypes'
        if (name) {
          url = `/serviceTypes?name=${encodeURIComponent(name)}`
        }

        const response = await api.get<ServiceType[]>(url)
        setAllServicesType(response.data)
        setServicesTypesLoaded(true)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(`Nenhum serviço encontrado ${name ? `com o nome "${name}"` : ''}.`)
          addToast({
            type: 'error',
            title: 'Erro ao Carregar',
            description: `Nenhum serviço foi encontrado ou houve um erro na busca ${name ? `com o nome "${name}"` : ''}.`,
          })
        } else {
          setError('Erro ao carregar serviços. Tente novamente.')
          addToast({
            type: 'error',
            title: 'Erro de Conexão',
            description: 'Não foi possível carregar os dados dos serviços.',
          })
        }
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
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          description: Yup.string(),
        })

        setIsLoading(true)

        await schema.validate(data, {
          abortEarly: false,
        })

        if (editingServiceTypesId) {
          await api.put<ServiceType>(`/serviceTypes/${editingServiceTypesId}`, {
            ...data,
          })
          addToast({
            type: 'success',
            title: 'Tipo de Serviço Atualizado',
            description: 'Os dados do tipo de serviço foram atualizados com sucesso!',
          })
          await reloadDataAndResetPage()
        } else {
          await api.post('/serviceTypes', {
            name: data.name,
            description: data.description,
            created_at: new Date().toISOString(),
            update_at: new Date().toISOString(),
          })
          addToast({
            type: 'success',
            title: 'Tipo de Serviço Cadastrado',
            description: 'Novo tipo de serviço cadastrado com sucesso!',
          })
          await reloadDataAndResetPage()
        }

        setEditingServiceTypesId(null)
        setNewServiceTypeData({ name: '', description: '' })
        formRef.current?.reset()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          addToast({
            type: 'error',
            title: 'Erro de Validação',
            description: 'Verifique os campos do formulário.',
          })
          return
        }
        addToast({
          type: 'error',
          title: `Erro ao ${editingServiceTypesId ? 'atualizar' : 'cadastrar'} tipo de serviço`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [editingServiceTypesId, addToast, reloadDataAndResetPage]
  )

  const handleSerchServiceType = useCallback(
    async (data: searchService) => {
      const { searchName } = data

      if (!searchName) {
        addToast({
          type: 'info',
          title: 'Campo de Busca Vazio',
          description: 'Por favor, digite um nome para buscar.',
        })
        return
      }

      setCurrentSearchTerm(searchName)
      await fetchServiceType(searchName)
      formRefSearch.current?.reset()
    },
    [addToast, fetchServiceType]
  )

  const handleEditServiceType = useCallback((serviceType: ServiceType) => {
    setEditingServiceTypesId(serviceType.id)

    formRef.current?.setData({
      name: serviceType.name,
      description: serviceType.description,
    })
    setNewServiceTypeData({
      name: serviceType.name,
      description: serviceType.description,
    })
  }, [])

  const handleListAllServiceTypes = useCallback(async () => {
    setCurrentSearchTerm('')
    formRefSearch.current?.reset()
    await fetchServiceType()
  }, [fetchServiceType])

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
        <Form
          ref={formRefSearch}
          onSubmit={handleSerchServiceType}
          initialData={undefined}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Input
            name="searchName"
            icon={FiUser}
            type="text"
            placeholder="Nome do Serviço para busca."
          />
          <Button type="submit">Buscar por Nome</Button>

          <Button onClick={handleListAllServiceTypes} disabled={isLoading} variant="info">
            Listar Todos os Serviços
          </Button>
        </Form>

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
        <Form
          ref={formRef}
          onSubmit={handleSubmitServiceType}
          initialData={newServiceTypeData}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Input name="name" icon={FiUser} placeholder="Nome do Serviço" />
          <Input
            name="description"
            icon={FiAlignJustify}
            placeholder="Descrição do Serviço"
          />
          <Button type="submit">{'Cadastrar Serviço'}</Button>
          <Button
            type="button"
            onClick={() => {
              formRef.current?.reset()
            }}
            variant="danger"
          >
            Cancelar Edição
          </Button>
        </Form>
      </MainContent>
    </Layout>
  )
}

export default MilServices
