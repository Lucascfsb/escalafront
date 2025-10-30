import { yupResolver } from '@hookform/resolvers/yup'
import type React from 'react'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiBookmark, FiFileText, FiType } from 'react-icons/fi'
import type { ServiceFormData } from '../../pages/MilServicesPage/types'

import { rankService } from '../../config/militaryOptions' 
import { Button } from '../Button/index'
import { Input } from '../Input/index'
import { SelectSearch } from '../SelectSearch'
import { serviceTypeSchema } from './MilServicesSchema' 
import { useToast } from '../../hooks/toast'

export type FormInput = {
  name: string
  description: string
  rank: {
    value: string
    label: string
  }
}

interface MilServicesFormProps {
  editingServiceId?: string | null
  initialData?: ServiceFormData 
  onSubmit: (data: ServiceFormData) => Promise<void>
  onCancelEdit?: () => void
}

export const MilServicesForm: React.FC<MilServicesFormProps> = ({
  editingServiceId,
  initialData,
  onSubmit,
  onCancelEdit,
}) => {
  const { addToast } = useToast()

  const defaultValues = initialData
    ? {
        name: initialData.name,
        description: initialData.description,
        rank: { value: initialData.rank, label: initialData.rank },
      }
    : {
        name: '',
        description: '',
        rank: null as unknown as FormInput['rank'], 
      }

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormInput>({
    resolver: yupResolver(serviceTypeSchema),
    defaultValues,
  })

  const handleFormSubmit = useCallback(
    async (data: FormInput) => {
      const apiData: ServiceFormData = {
        name: data.name,
        description: data.description,
        rank: data.rank.value, 
      }
      try {
        await onSubmit(apiData)
        if (!editingServiceId) {
          reset(defaultValues)
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: `Erro ao ${editingServiceId ? 'atualizar' : 'cadastrar'} tipo de serviço`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      }
    },
    [onSubmit, editingServiceId, addToast, reset, defaultValues],
  )

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            icon={FiType}
            placeholder="Nome do Tipo de Serviço"
            error={errors.name?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Input
            icon={FiFileText}
            placeholder="Descrição (Opcional)"
            error={errors.description?.message}
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
            options={rankService} 
            value={field.value || null} 
            onChange={option => field.onChange(option)}
            error={errors.rank?.message}
          />
        )}
      />

      <Button type="submit">
        {editingServiceId ? 'Salvar Alterações' : 'Cadastrar Tipo de Serviço'}
      </Button>

      {editingServiceId && (
        <Button type="button" onClick={onCancelEdit} variant="danger">
          Cancelar Edição
        </Button>
      )}
    </form>
  )
}