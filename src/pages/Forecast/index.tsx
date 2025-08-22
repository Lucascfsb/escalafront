import axios from 'axios'
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
  subWeeks,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import api from '../../services/apiClient'

import Button from '../../components/Button'
import Layout from '../../components/Layout'
import Table from '../../components/Table'
import { MainContent } from './styles'

export interface ServiceType {
  id: string
  name: string
  description?: string
}

export interface ServiceRendered {
  id: string
  military_id: string | null
  military: Military | null
  service_types_id: string
  serviceType: ServiceType
  service_date: string
  created_at: string
  updated_at: string
}

interface Military {
  id: string
  name: string
  rank: string
  qualification: string
  date_of_entry: string
  created_at: string
  update_at: string
}

const Forecast: React.FC = () => {
  const { addToast } = useToast()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart(prevDate => subWeeks(prevDate, 1))
  }, [])

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prevDate => addWeeks(prevDate, 1))
  }, [])

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [servicesRendered, setServicesRendered] = useState<ServiceRendered[]>([])
  const [allMilitaries, setAllMilitaries] = useState<Military[]>([])

  const daysOfWeek = useMemo(() => {
    const start = currentWeekStart
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentWeekStart])

  const availableMilitaries = useMemo(() => {
    const assignedMilitaryIds = servicesRendered
      .filter(entry => entry.military_id !== null)
      .map(entry => entry.military_id)

    const unassignedMilitaries = allMilitaries.filter(
      military => !assignedMilitaryIds.includes(military.id)
    )

    return unassignedMilitaries
  }, [allMilitaries, servicesRendered])

  const fetchServiceTypes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get<ServiceType[]>('/serviceTypes')

      const orderedServiceTypes = response.data.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })

      setServiceTypes(orderedServiceTypes)
    } catch (err) {
      setError('Erro ao carregar tipos de serviço.')
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Não foi possível carregar os tipos de serviço.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  const fetchAllMilitaries = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get<Military[]>('/militaries')
      setAllMilitaries(response.data)
    } catch (err) {
      setError('Erro ao carregar militares.')
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Não foi possível carregar a lista de militares.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  const fetchServicesRenderedData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const startDate = format(currentWeekStart, 'yyyy-MM-dd')
      const endDate = format(
        endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
        'yyyy-MM-dd'
      )

      const response = await api.get<ServiceRendered[]>(
        `/serviceRendered?startDate=${startDate}&endDate=${endDate}`
      )
      setServicesRendered(response.data)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Nenhum serviço encontrado para esta semana.')
      } else {
        setError('Erro ao carregar previsão de escala.')
        addToast({
          type: 'error',
          title: 'Erro',
          description: 'Não foi possível carregar a previsão de escala.',
        })
      }
      setServicesRendered([])
    } finally {
      setIsLoading(false)
    }
  }, [currentWeekStart, addToast])

  useEffect(() => {
    fetchServiceTypes()
    fetchAllMilitaries()
  }, [fetchServiceTypes, fetchAllMilitaries])

  useEffect(() => {
    fetchServicesRenderedData()
  }, [fetchServicesRenderedData])

  const handleAssignMilitary = useCallback(
    async (
      serviceTypeId: string,
      date: Date,
      militaryId: string | null,
      currentEntry: ServiceRendered | undefined
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        if (currentEntry) {
          if (militaryId === null) {
            await api.delete(`/serviceRendered/${currentEntry.id}`)

            setServicesRendered(prevServices =>
              prevServices.filter(entry => entry.id !== currentEntry.id)
            )

            addToast({
              type: 'success',
              title: 'Atribuição Removida',
              description: 'Militar desatribuído com sucesso!',
            })
          } else {
            const dataToUpdate = { military_id: militaryId }
            await api.put(`/serviceRendered/${currentEntry.id}`, dataToUpdate)

            const assignedMilitary = allMilitaries.find(
              military => military.id === militaryId
            )

            if (!assignedMilitary) {
              throw new Error('Militar não encontrado na lista.')
            }

            const updatedServiceRendered = {
              ...currentEntry,
              military_id: militaryId,
              military: assignedMilitary, // Use o objeto completo aqui
            }
            setServicesRendered(prevServices =>
              prevServices.map(entry =>
                entry.id === updatedServiceRendered.id ? updatedServiceRendered : entry
              )
            )

            addToast({
              type: 'success',
              title: 'Atribuição Atualizada',
              description: 'Militar atribuído com sucesso!',
            })
          }
        } else {
          if (!militaryId) {
            addToast({
              type: 'info',
              title: 'Nenhuma Alteração',
              description: 'Nenhum militar selecionado para criar uma nova entrada.',
            })
            return
          }

          const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss')
          const dataToSave = {
            military_id: militaryId,
            service_types_id: serviceTypeId,
            service_date: formattedDate,
          }

          const response = await api.post('/serviceRendered', dataToSave)

          const newServiceRendered = response.data
          setServicesRendered(prevServices => [...prevServices, newServiceRendered])

          addToast({
            type: 'success',
            title: 'Atribuição Criada',
            description: 'Nova atribuição de militar criada com sucesso!',
          })
        }
      } catch (err) {
        let errorMessage = 'Erro ao atribuir militar. Tente novamente.'
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          errorMessage = err.response.data.message
        }
        setError(errorMessage)
        addToast({
          type: 'error',
          title: 'Erro de Atribuição',
          description: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, allMilitaries]
  )

  const getServiceRenderedEntry = useCallback(
    (serviceTypeId: string, date: Date) => {
      return servicesRendered.find(
        entry =>
          entry.service_types_id === serviceTypeId &&
          isSameDay(parseISO(entry.service_date), date)
      )
    },
    [servicesRendered]
  )

  const formatDateHeader = useCallback((date: Date) => {
    return format(date, 'eeeeee - dd/MM', { locale: ptBR })
  }, [])

  return (
    <Layout>
      <MainContent>
        {isLoading && <p>Carregando...</p>}
        {isAdmin && (
          <>
            <h2>Tabela de Edição</h2>

            <div>
              <h3>
                {format(currentWeekStart, 'dd MMM', { locale: ptBR })} -{' '}
                {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </h3>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '750px',
                  width: '100%',
                  marginBottom: '1rem',
                }}
              >
                <Button type="button" onClick={handlePreviousWeek} disabled={isLoading}>
                  Anterior
                </Button>
                <Button type="button" onClick={handleNextWeek} disabled={isLoading}>
                  Próxima
                </Button>
              </div>
            </div>

            <Table
              serviceTypes={serviceTypes}
              daysOfWeek={daysOfWeek}
              allMilitaries={allMilitaries}
              servicesRendered={servicesRendered}
              isLoading={isLoading}
              handleAssignMilitary={handleAssignMilitary}
              getServiceRenderedEntry={getServiceRenderedEntry}
              formatDateHeader={formatDateHeader}
            />
          </>
        )}

        <h2>Previsão de Escala de Serviço</h2>

        <div>
          <h3>
            {format(currentWeekStart, 'dd MMM', { locale: ptBR })} -{' '}
            {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '750px',
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <Button type="button" onClick={handlePreviousWeek} disabled={isLoading}>
              Anterior
            </Button>
            <Button type="button" onClick={handleNextWeek} disabled={isLoading}>
              Próxima
            </Button>
          </div>
        </div>

        {serviceTypes.length > 0 && daysOfWeek.length > 0 ? (
          <Table
            serviceTypes={serviceTypes}
            daysOfWeek={daysOfWeek}
            allMilitaries={allMilitaries}
            servicesRendered={servicesRendered}
            isLoading={isLoading}
            handleAssignMilitary={handleAssignMilitary}
            getServiceRenderedEntry={getServiceRenderedEntry}
            formatDateHeader={formatDateHeader}
            isReadOnly={true}
          />
        ) : (
          <p>Nenhuma função de serviço ou data para exibir a previsão.</p>
        )}
      </MainContent>
    </Layout>
  )
}

export default Forecast
