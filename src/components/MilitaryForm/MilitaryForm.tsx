import { yupResolver } from '@hookform/resolvers/yup'
import { format, parseISO } from 'date-fns'
import type React from 'react'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiAward, FiBookmark, FiCalendar, FiUser } from 'react-icons/fi'

import { useToast } from '../../hooks/toast'
import { militaresPageSchema } from '../../pages/MilitariesPage/schema'
import type { MilitaryFormData } from '../../pages/MilitariesPage/types'
import { Button } from '../Button/index'
import { Input } from '../Input/index'
import { SelectSearch } from '../SelectSearch'

interface MilitaryFormProps {
  editingMilitaryId: string | null
  initialData?: MilitaryFormData
  onSubmit: (data: MilitaryFormData) => Promise<void>
  onCancelEdit: () => void
}

export const MilitaryForm: React.FC<MilitaryFormProps> = ({
  editingMilitaryId,
  initialData,
  onSubmit,
  onCancelEdit,
}) => {
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<MilitaryFormData>({
    resolver: yupResolver(militaresPageSchema),
  })

  useEffect(() => {
    if (initialData) {
      const dataForInput = initialData.date_of_entry
        ? format(parseISO(initialData.date_of_entry), 'yyyy-MM-dd')
        : ''

      reset({
        ...initialData,
        date_of_entry: dataForInput,
      })
    } else {
      reset()
    }
  }, [initialData, reset])

  const handleFormSubmit = useCallback(
    async (data: MilitaryFormData) => {
      try {
        await onSubmit(data)
      } catch (err) {
        addToast({
          type: 'error',
          title: `Erro ao ${editingMilitaryId ? 'atualizar' : 'cadastrar'} militar`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      }
    },
    [onSubmit, editingMilitaryId, addToast]
  )

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        icon={FiUser}
        placeholder="Nome de Guerra"
        {...register('name')}
        error={errors.name?.message}
      />

      <Controller
        name="rank"
        control={control}
        render={({ field }) => (
          <SelectSearch
            {...field}
            icon={FiBookmark}
            options={[
              { value: 'Sd', label: 'Sd' },
              { value: 'Cb', label: 'Cb' },
              { value: '3° Sgt', label: '3° Sgt' },
              { value: '2° Sgt', label: '2° Sgt' },
              { value: '1° Sgt', label: '1° Sgt' },
              { value: 'Asp', label: 'Asp' },
              { value: '2° Ten', label: '2° Ten' },
              { value: '1° Ten', label: '1° Ten' },
              { value: 'Cap', label: 'Cap' },
              { value: 'Maj', label: 'Maj' },
              { value: 'Ten-Cel', label: 'Ten-Cel' },
              { value: 'Cel', label: 'Cel' },
            ]}
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
            options={[
              { value: 'Formação', label: 'Formação' },
              { value: 'Especialização', label: 'Especialização' },
              { value: 'Aperfeiçoamento', label: 'Aperfeiçoamento' },
              { value: 'Altos Estudos I', label: 'Altos Estudos I' },
              { value: 'Altos Estudos II', label: 'Altos Estudos II' },
            ]}
          />
        )}
      />
      <Input
        icon={FiCalendar}
        type="date"
        {...register('date_of_entry')}
        error={errors.date_of_entry?.message}
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
