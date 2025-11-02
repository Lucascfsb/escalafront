import { isSameDay, parseISO } from 'date-fns'
import type React from 'react'

import { FiUser } from 'react-icons/fi'
import { SelectSearch } from '../SelectSearch'

import { border } from 'polished'
import {
  SelectWrapper,
  TableComponent,
  TableContainer,
  TableData,
  TableHeader,
} from './styles'

export interface ServiceType {
  id: string
  name: string
  description?: string
}

interface OptionType {
  value: string
  label: string
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

interface TableProps {
  serviceTypes: ServiceType[]
  daysOfWeek: Date[]
  allMilitaries: Military[]
  servicesRendered: ServiceRendered[]
  isLoading: boolean
  handleAssignMilitary: (
    serviceTypeId: string,
    date: Date,
    militaryId: string | null,
    currentEntry: ServiceRendered | undefined
  ) => Promise<void>
  getServiceRenderedEntry: (
    serviceTypeId: string,
    date: Date
  ) => ServiceRendered | undefined
  formatDateHeader: (date: Date) => string
  isReadOnly?: boolean
}

const Table: React.FC<TableProps> = ({
  serviceTypes,
  daysOfWeek,
  allMilitaries,
  servicesRendered,
  isLoading,
  handleAssignMilitary,
  getServiceRenderedEntry,
  formatDateHeader,
  isReadOnly,
}) => {
  const selectStyles = {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#312e38',
      border: '1px solid #232129',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      fontSize: '14px',
    }),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    option: (base: any, state: any) => ({
      ...base,
      padding: '6px 8px',
      backgroundColor: state.isSelected
        ? '#f0c14b'
        : state.isFocused
          ? '#3e3b47'
          : '#312e38',
      color: '#f4ede8',
      cursor: 'pointer',
    }),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    control: (base: any) => ({
      ...base,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      minHeight: '30px',
    }),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    singleValue: (base: any) => ({
      ...base,
      color: '#f4ede8',
    }),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    placeholder: (base: any) => ({
      ...base,
      color: '#999591',
      fontSize: '14px !important',
    }),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    input: (base: any) => ({
      ...base,
      color: '#333',
      margin: 0,
      padding: 0,
      fontSize: '14px !important',
    }),
  }

  return (
    <div>
      <TableContainer>
        <TableComponent>
          <thead>
            <tr>
              <TableHeader>Função</TableHeader>
              {daysOfWeek.map(day => (
                <TableHeader key={day.toISOString()}>{formatDateHeader(day)}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {serviceTypes.map(serviceType => (
              <tr key={serviceType.id}>
                <TableData>{serviceType.name}</TableData>
                {daysOfWeek.map(day => {
                  const currentEntry = getServiceRenderedEntry(serviceType.id, day)
                  const militaryName = currentEntry?.military
                    ? `${currentEntry.military.rank} ${currentEntry.military.name}`
                    : '(Nenhum)'
                  const assignedMilitaryIdsOnThisDay = servicesRendered
                    .filter(
                      entry =>
                        entry.military_id !== null &&
                        isSameDay(parseISO(entry.service_date), day)
                    )
                    .map(entry => entry.military_id)

                  const availableMilitariesForDay = allMilitaries.filter(
                    military => !assignedMilitaryIdsOnThisDay.includes(military.id)
                  )

                  if (currentEntry?.military) {
                    availableMilitariesForDay.push(currentEntry.military)
                  }

                  const militaryOptions = availableMilitariesForDay
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(military => ({
                      value: military.id,
                      label: `${military.rank} ${military.name}`,
                    }))

                  return (
                    <TableData key={`${serviceType.id}-${day.toISOString()}`}>
                      {isReadOnly ? (
                        <span>{militaryName}</span>
                      ) : (
                        <SelectWrapper>
                          <SelectSearch
                            icon={FiUser}
                            options={militaryOptions}
                            placeholder="Selecione o militar"
                            menuPortalTarget={document.body}
                            styles={selectStyles}
                            value={
                              currentEntry?.military
                                ? {
                                    value: currentEntry.military.id,
                                    label: `${currentEntry.military.rank} ${currentEntry.military.name}`,
                                  }
                                : null
                            }
                            onChange={(option: OptionType | null) =>
                              handleAssignMilitary(
                                serviceType.id,
                                day,
                                option?.value ?? null,
                                currentEntry
                              )
                            }
                            isDisabled={isLoading}
                          />
                        </SelectWrapper>
                      )}
                    </TableData>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </TableComponent>
      </TableContainer>
    </div>
  )
}

export { Table }
