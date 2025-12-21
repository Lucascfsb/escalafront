import { yupResolver } from '@hookform/resolvers/yup'
import { format, parseISO } from 'date-fns'
import type React from 'react'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiAward, FiBookmark, FiCalendar, FiList, FiUser } from 'react-icons/fi'

import { qualificationOptions, rankOptions } from '../../config/militaryOptions'
import { useToast } from '../../hooks/toast'
import type { MilitaryFormData } from '../../pages/MilitariesPage/types'
import { Button } from '../Button/index'
import { Input } from '../Input/index'
import { SelectSearch } from '../SelectSearch'
import { militaresPageSchema } from './MilitarySchema'

export type FormInput = {
  name: string
  rank: {
    value: string
    label: string
  }
  qualification: {
    value: string
    label: string
  }
  date_of_entry: string
  service_types?: Array<{ value: string; label: string }>
}

interface MilitaryFormProps {
  editingMilitaryId?: string | null
  initialData?: MilitaryFormData
  serviceTypes: Array<{ id: string; name: string; description: string | null }>
  isLoadingServiceTypes?: boolean
  onSubmit: (data: MilitaryFormData) => Promise<void>
  onCancelEdit?: () => void
}

export const MilitaryForm: React.FC<MilitaryFormProps> = ({
  editingMilitaryId,
  initialData,
  serviceTypes,
  isLoadingServiceTypes,
  onSubmit,
  onCancelEdit,
}) => {
  const { addToast } = useToast()

  const serviceTypeOptions = serviceTypes.map(st => ({
    value: st.id,
    label: st.name,
  }))

  const defaultValues = initialData
    ? {
        name: initialData.name,
        rank: { value: initialData.rank, label: initialData.rank },
        qualification: {
          value: initialData.qualification,
          label: initialData.qualification,
        },
        date_of_entry: initialData.date_of_entry
          ? format(parseISO(initialData.date_of_entry), 'yyyy-MM-dd')
          : '',
        service_types: initialData.service_types
          ? initialData.service_types.map(stId => {
              const found = serviceTypes.find(st => st.id === stId)
              return {
                value: stId,
                label: found?.name || stId,
              }
            })
          : [],
      }
    : {
        name: '',
        rank: null as unknown as FormInput['rank'],
        qualification: null as unknown as FormInput['qualification'],
        date_of_entry: '',
        service_types: [],
      }

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<FormInput>({
    resolver: yupResolver(militaresPageSchema),
    defaultValues,
  })

  const handleFormSubmit = useCallback(
    async (data: FormInput) => {
      const apiData: MilitaryFormData = {
        ...data,
        rank: data.rank.value,
        qualification: data.qualification.value,
        service_types: data.service_types?.map(st => st.value) || [],
      }
      try {
        await onSubmit(apiData)
        if (!editingMilitaryId) {
          reset(defaultValues)
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: `Erro ao ${editingMilitaryId ? 'atualizar' : 'cadastrar'} militar`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      }
    },
    [onSubmit, editingMilitaryId, addToast, reset, defaultValues]
  )

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name)
      setValue('rank', { value: initialData.rank, label: initialData.rank })
      setValue('qualification', {
        value: initialData.qualification,
        label: initialData.qualification,
      })
      setValue(
        'date_of_entry',
        initialData.date_of_entry
          ? format(parseISO(initialData.date_of_entry), 'yyyy-MM-dd')
          : ''
      )
      setValue(
        'service_types',
        initialData.service_types
          ? initialData.service_types.map(stId => {
              const found = serviceTypes.find(st => st.id === stId)
              return {
                value: stId,
                label: found?.name || stId,
              }
            })
          : []
      )
    }
  }, [initialData, setValue, serviceTypes])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Controller
        name="name"
        control={control}
        render={field => (
          <Input
            name={''}
            icon={FiUser}
            placeholder="Nome de Guerra"
            error={errors.name?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="rank"
        control={control}
        render={({ field }) => (
          <SelectSearch
            {...field}
            icon={FiBookmark}
            placeholder="Posto/Graduação"
            options={rankOptions}
            value={field.value || null}
            onChange={option => field.onChange(option)}
            error={errors.rank?.message}
          />
        )}
      />

      <Controller
        name="qualification"
        control={control}
        render={({ field }) => (
          <SelectSearch
            {...field}
            icon={FiAward}
            placeholder="Qualificação"
            options={qualificationOptions}
            value={field.value || null}
            onChange={option => field.onChange(option)}
            error={errors.qualification?.message}
          />
        )}
      />

      <Controller
        name="date_of_entry"
        control={control}
        render={field => (
          <Input
            name={''}
            icon={FiCalendar}
            type="date"
            {...field}
            error={errors.date_of_entry?.message}
          />
        )}
      />

      <Controller
        name="service_types"
        control={control}
        render={({ field }) => (
          <div style={{ marginBottom: '1.5rem' }}>
            {isLoadingServiceTypes ? (
              <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
                Carregando tipos de serviço...
              </p>
            ) : serviceTypeOptions.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px' }}>
                Nenhum tipo de serviço disponível.
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px',
                  padding: '16px',
                  backgroundColor: '#808000',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              >
                {serviceTypeOptions.map(option => {
                  const isChecked =
                    field.value?.some(st => st.value === option.value) || false

                  return (
                    <label
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        backgroundColor: isChecked ? '#e3f2fd' : '#fff',
                        borderRadius: '6px',
                        border: `1px solid ${isChecked ? '#2196f3' : '#ddd'}`,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        if (!isChecked) {
                          e.currentTarget.style.backgroundColor = '#f5f5f5'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isChecked) {
                          e.currentTarget.style.backgroundColor = '#fff'
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const currentValue = field.value || []
                          if (e.target.checked) {
                            field.onChange([...currentValue, option])
                          } else {
                            field.onChange(
                              currentValue.filter(st => st.value !== option.value)
                            )
                          }
                        }}
                        style={{
                          cursor: 'pointer',
                          width: '18px',
                          height: '18px',
                          accentColor: '#2196f3',
                        }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>
                        {option.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}

            {errors.service_types?.message && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '8px' }}>
                {errors.service_types.message}
              </p>
            )}
          </div>
        )}
      />

      <Button type="submit">
        {editingMilitaryId ? 'Salvar Alterações' : 'Cadastrar Militar'}
      </Button>
      {editingMilitaryId && (
        <Button type="button" onClick={onCancelEdit} variant="danger">
          Cancelar Edição
        </Button>
      )}
    </form>
  )
}
