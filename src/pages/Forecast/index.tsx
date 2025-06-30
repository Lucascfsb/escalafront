import axios from 'axios'
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../hooks/toast'
import api from '../../services/apiClient'

import Layout from '../../components/Layout'
import {
  MainContent,
  SelectInput,
  TableContainer,
  TableData,
  TableHeader,
} from './styles'

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

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [servicesRendered, setServicesRendered] = useState<ServiceRendered[]>([])
  const [allMilitaries, setAllMilitaries] = useState<Military[]>([])

  const daysOfWeek = useMemo(() => {
    const start = currentWeekStart
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentWeekStart])

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
        `/services-rendered?startDate=${startDate}&endDate=${endDate}`
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
        const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss')
        const dataToSave = {
          military_id: militaryId,
          service_types_id: serviceTypeId,
          service_date: formattedDate,
        } as Partial<ServiceRendered>

        if (currentEntry) {
          await api.put(`/services-rendered/${currentEntry.id}`, dataToSave)
          addToast({
            type: 'success',
            title: 'Atribuição Atualizada',
            description: 'Militar atribuído/atualizado com sucesso!',
          })
        } else {
          if (!militaryId) {
            addToast({
              type: 'info',
              title: 'Nenhuma Alteração',
              description: 'Nenhum militar selecionado para criar uma nova entrada.',
            })
            setIsLoading(false)
            return
          }

          await api.post('/services-rendered', {
            ...dataToSave,
            military: allMilitaries.find(m => m.id === militaryId)?.name || null,
            serviceTypes: serviceTypes.find(st => st.id === serviceTypeId)?.name,
          })
          addToast({
            type: 'success',
            title: 'Atribuição Criada',
            description: 'Nova atribuição de militar criada com sucesso!',
          })
        }
        await fetchServicesRenderedData()
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
    [addToast, fetchServicesRenderedData, allMilitaries, serviceTypes]
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
        {error && <p>{error}</p>}
        {isLoading && <p>Carregando...</p>}

        <h2>Previsão de Escala de Serviço</h2>

        <div>
          <h3>
            {format(currentWeekStart, 'dd MMM', { locale: ptBR })} -{' '}
            {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </h3>
        </div>

        {serviceTypes.length > 0 && daysOfWeek.length > 0 ? (
          <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <TableContainer>
              <thead>
                <tr>
                  <TableHeader>Função</TableHeader>
                  {daysOfWeek.map(day => (
                    <TableHeader key={day.toISOString()}>
                      {formatDateHeader(day)}
                    </TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {serviceTypes.map(serviceType => (
                  <tr key={serviceType.id}>
                    <TableData>{serviceType.name}</TableData>{' '}
                    {/* Usando a prop para estilizar */}
                    {daysOfWeek.map(day => {
                      const entry = getServiceRenderedEntry(serviceType.id, day)
                      const currentMilitaryId = entry?.military?.id || ''

                      return (
                        <TableData key={`${serviceType.id}-${day.toISOString()}`}>
                          <SelectInput
                            value={currentMilitaryId}
                            onChange={e => {
                              const selectedMilitaryId = e.target.value
                              handleAssignMilitary(
                                serviceType.id,
                                day,
                                selectedMilitaryId || null,
                                entry
                              )
                            }}
                            disabled={isLoading}
                          >
                            <option value="">(Nenhum)</option>
                            {allMilitaries.map(military => (
                              <option key={military.id} value={military.id}>
                                {military.name}
                              </option>
                            ))}
                          </SelectInput>
                        </TableData>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </TableContainer>
          </div>
        ) : (
          <p>Nenhuma função de serviço ou data para exibir a previsão.</p>
        )}
      </MainContent>
    </Layout>
  )
}

export default Forecast
