import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subWeeks,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Layout } from '../../components/Layout'
import { api } from '../../services/apiClient'
import {
  MilitaryCard,
  NavigationContainer,
  PageContainer,
  SuggestionTable,
  TableCell,
  TableHeader,
} from './styles'
import type { MilitarySuggestion, ServiceType } from './types'

const ScheduleSuggestionPage: React.FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [suggestions, setSuggestions] = useState<Map<string, MilitarySuggestion[]>>(
    new Map()
  )
  const [isLoading, setIsLoading] = useState(false)

  const daysOfWeek = useMemo(() => {
    const start = currentWeekStart
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentWeekStart])

  const formatDateHeader = useCallback((date: Date) => {
    return format(date, 'eeeeee - dd/MM', { locale: ptBR })
  }, [])

  const loadServiceTypes = useCallback(async () => {
    try {
      const response = await api.get('/serviceTypes')
      setServiceTypes(response.data)
    } catch (error) {
      console.error('Erro ao carregar tipos de serviço:', error)
    }
  }, [])

  const loadAllSuggestions = useCallback(async () => {
    if (serviceTypes.length === 0) return

    setIsLoading(true)
    const newSuggestions = new Map<string, MilitarySuggestion[]>()

    try {
      const promises = serviceTypes.flatMap(serviceType =>
        daysOfWeek.map(async day => {
          const key = `${serviceType.id}-${format(day, 'yyyy-MM-dd')}`
          try {
            const response = await api.get('/serviceRendered/suggest', {
              params: {
                service_types_id: serviceType.id,
                service_date: format(day, 'yyyy-MM-dd'),
              },
            })
            const top3 = response.data.slice(0, 3)
            newSuggestions.set(key, top3)
          } catch (error) {
            console.error(`Erro ao carregar sugestões para ${key}:`, error)
            newSuggestions.set(key, [])
          }
        })
      )

      await Promise.all(promises)
      setSuggestions(newSuggestions)
    } finally {
      setIsLoading(false)
    }
  }, [serviceTypes, daysOfWeek])

  useEffect(() => {
    loadServiceTypes()
  }, [loadServiceTypes])

  useEffect(() => {
    loadAllSuggestions()
  }, [loadAllSuggestions])

  const getSuggestionsForCell = (
    serviceTypeId: string,
    date: Date
  ): MilitarySuggestion[] => {
    const key = `${serviceTypeId}-${format(date, 'yyyy-MM-dd')}`
    return suggestions.get(key) || []
  }

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => subWeeks(prev, 1))
  }, [])

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addWeeks(prev, 1))
  }, [])

  const formatDaysSince = (days: number) => {
    if (days === 999999) return '∞'
    return `${days}d`
  }

  const formatLastServiceDate = (date: string | null) => {
    if (!date) return 'Nunca serviu'
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
  }

  return (
    <Layout>
      <PageContainer>
        <h1>Sugestão de Escala de Serviço</h1>
        <p>Top 3 militares mais folgados para cada serviço/data</p>

        <div>
          <h3>
            {format(currentWeekStart, 'dd MMM', { locale: ptBR })} -{' '}
            {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </h3>
        </div>

        <NavigationContainer>
          <Button type="button" onClick={handlePreviousWeek} disabled={isLoading}>
            Anterior
          </Button>
          <Button type="button" onClick={handleNextWeek} disabled={isLoading}>
            Próxima
          </Button>
        </NavigationContainer>

        {isLoading ? (
          <p>Carregando sugestões...</p>
        ) : (
          <SuggestionTable>
            <thead>
              <tr>
                <TableHeader>Serviço</TableHeader>
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
                  <TableCell isServiceName>{serviceType.name}</TableCell>
                  {daysOfWeek.map(day => {
                    const cellSuggestions = getSuggestionsForCell(serviceType.id, day)
                    return (
                      <TableCell key={`${serviceType.id}-${day.toISOString()}`}>
                        {cellSuggestions.length === 0 ? (
                          <p style={{ fontSize: '0.875rem', color: '#999' }}>
                            Sem sugestões
                          </p>
                        ) : (
                          cellSuggestions.map((suggestion, index) => (
                            <MilitaryCard key={suggestion.military.id} rank={index + 1}>
                              <div className="rank">#{index + 1}</div>
                              <div className="info">
                                <strong>
                                  {suggestion.military.rank} {suggestion.military.name}
                                </strong>
                                <div className="stats">
                                  <span>
                                    Folga:{' '}
                                    {formatDaysSince(suggestion.daysSinceLastService)}
                                  </span>
                                  <span>Total: {suggestion.totalServicesInThisType}</span>
                                </div>
                                <div className="last-service">
                                  <small>
                                    Último:{' '}
                                    {formatLastServiceDate(suggestion.lastServiceDate)}
                                  </small>
                                </div>
                              </div>
                            </MilitaryCard>
                          ))
                        )}
                      </TableCell>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </SuggestionTable>
        )}
      </PageContainer>
    </Layout>
  )
}

export { ScheduleSuggestionPage }
