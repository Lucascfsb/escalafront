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
import { useCallback, useMemo, useState } from 'react'

import { Layout } from '../../components/Layout'
import { Pagination } from '../../components/Pagination'
import { Table } from '../../components/Table'
import { useAuth } from '../../hooks/auth'
import { useForecastData } from '../../hooks/useForecastData'
import { useServiceAssignment } from '../../hooks/useServiceAssignment'
import { MainContent } from './styles'
import type { ServiceRendered } from './types'

const ForecastPage: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  const {
    serviceTypes,
    militaries,
    servicesRendered,
    setServicesRendered,
    isLoading,
    error,
  } = useForecastData(currentWeekStart)

  const daysOfWeek = useMemo(() => {
    const start = currentWeekStart
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentWeekStart])

  const weekRange = useMemo(() => {
    const endDate = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    const start = format(currentWeekStart, 'dd MMM', { locale: ptBR })
    const end = format(endDate, 'dd MMM yyyy', { locale: ptBR })
    return `Semana de ${start} - ${end}`
  }, [currentWeekStart])

  const formatDateHeader = useCallback((date: Date) => {
    return format(date, 'eeeeee - dd/MM', { locale: ptBR })
  }, [])

  const { handleAssign, isAssigning } = useServiceAssignment(militaries)

  const handleAssignMilitary = useCallback(
    async (
      serviceTypeId: string,
      date: Date,
      militaryId: string | null,
      currentEntry: ServiceRendered | undefined
    ) => {
      try {
        const result = await handleAssign(serviceTypeId, date, militaryId, currentEntry)

        if (result === null) return

        if (typeof result === 'string') {
          setServicesRendered(prev => prev.filter(entry => entry.id !== result))
        } else {
          setServicesRendered(prev => {
            const exists = prev.find(entry => entry.id === result.id)
            if (exists) {
              return prev.map(entry => (entry.id === result.id ? result : entry))
            }
            return [...prev, result]
          })
        }
      } catch (err) {}
    },
    [handleAssign, setServicesRendered]
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

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => subWeeks(prev, 1))
  }, [])

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addWeeks(prev, 1))
  }, [])

  const currentPage = 1
  const totalPages = 1

  return (
    <Layout>
      <MainContent>
        {error && <p style={{ color: '#c53030' }}>{error}</p>}

        {isAdmin && (
          <>
            <h2>Tabela de Edição</h2>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h3>{weekRange}</h3>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => {
                  if (page < currentPage) handlePreviousWeek()
                  if (page > currentPage) handleNextWeek()
                }}
                isLoading={isLoading || isAssigning}
              />
            </div>

            <Table
              serviceTypes={serviceTypes}
              daysOfWeek={daysOfWeek}
              allMilitaries={militaries}
              servicesRendered={servicesRendered}
              isLoading={isLoading || isAssigning}
              handleAssignMilitary={handleAssignMilitary}
              getServiceRenderedEntry={getServiceRenderedEntry}
              formatDateHeader={formatDateHeader}
            />
          </>
        )}

        <h2>Previsão de Escala de Serviço</h2>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h3>{weekRange}</h3>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={page => {
              if (page < currentPage) handlePreviousWeek()
              if (page > currentPage) handleNextWeek()
            }}
            isLoading={isLoading}
          />
        </div>

        {serviceTypes.length > 0 && daysOfWeek.length > 0 ? (
          <Table
            serviceTypes={serviceTypes}
            daysOfWeek={daysOfWeek}
            allMilitaries={militaries}
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

export { ForecastPage }
