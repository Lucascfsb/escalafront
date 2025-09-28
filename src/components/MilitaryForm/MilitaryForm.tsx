import { yupResolver } from '@hookform/resolvers/yup'
import { format, parseISO } from 'date-fns'
import type React from 'react'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiAward, FiBookmark, FiCalendar, FiUser } from 'react-icons/fi'

import { qualificationOptions, rankOptions } from '../../config/militaryOptions'
import { useToast } from '../../hooks/toast'
import type { MilitaryFormData } from '../../pages/MilitariesPage/types'
import { Button } from '../Button/index'
import { Input } from '../Input/index'
import { SelectSearch } from '../SelectSearch'
import { militaresPageSchema } from './schema'

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
}

interface MilitaryFormProps {
  editingMilitaryId?: string | null
  initialData?: MilitaryFormData
  onSubmit: (data: MilitaryFormData) => Promise<void>
  onCancelEdit?: () => void
}

export const MilitaryForm: React.FC<MilitaryFormProps> = ({
  editingMilitaryId,
  initialData,
  onSubmit,
  onCancelEdit,
}) => {
  const { addToast } = useToast()

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
      }
    : {
        name: '',
        rank: null as unknown as FormInput['rank'],
        qualification: null as unknown as FormInput['qualification'],
        date_of_entry: '',
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
    }
  }, [initialData, setValue])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
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
        render={({ field, fieldState: { error } }) => (
          <Input
            icon={FiCalendar}
            type="date"
            {...field}
            error={errors.date_of_entry?.message}
          />
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
