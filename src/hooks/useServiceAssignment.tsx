import axios from 'axios'
import { format } from 'date-fns'
import { useCallback, useState } from 'react'
import type { Military, ServiceRendered } from '../pages/ForecastPage/types'
import { forecastService } from '../services/forecastService'
import { useToast } from './toast'

export const useServiceAssignment = (militaries: Military[]) => {
  const { addToast } = useToast()
  const [isAssigning, setIsAssigning] = useState(false)

  const handleAssign = useCallback(
    async (
      serviceTypeId: string,
      date: Date,
      militaryId: string | null,
      currentEntry: ServiceRendered | undefined
    ): Promise<ServiceRendered | string | null> => {
      setIsAssigning(true)

      try {
        // Caso 1: Remover atribuição existente
        if (currentEntry && militaryId === null) {
          await forecastService.deleteServiceRendered(currentEntry.id)

          addToast({
            type: 'success',
            title: 'Atribuição Removida',
            description: 'Militar desatribuído com sucesso!',
          })

          return currentEntry.id
        }

        // Caso 2: Atualizar atribuição existente
        if (currentEntry && militaryId) {
          const updatedService = await forecastService.updateServiceRendered(
            currentEntry.id,
            {
              military_id: militaryId,
            }
          )

          // ✅ Lógica privada do hook (não precisa de util)
          const military = militaries.find(m => m.id === militaryId)

          if (!military) {
            throw new Error('Militar não encontrado na lista.')
          }

          addToast({
            type: 'success',
            title: 'Atribuição Atualizada',
            description: 'Militar atribuído com sucesso!',
          })

          return {
            ...updatedService,
            military,
          }
        }

        // Caso 3: Criar nova atribuição
        if (!currentEntry && militaryId) {
          const newService = await forecastService.createServiceRendered({
            military_id: militaryId,
            service_types_id: serviceTypeId,
            service_date: format(date, 'yyyy-MM-dd HH:mm:ss'),
          })

          const military = militaries.find(m => m.id === militaryId)

          addToast({
            type: 'success',
            title: 'Atribuição Criada',
            description: 'Nova atribuição de militar criada com sucesso!',
          })

          return {
            ...newService,
            military: military || null,
          }
        }

        // Caso 4: Nenhuma alteração
        addToast({
          type: 'info',
          title: 'Nenhuma Alteração',
          description: 'Nenhum militar selecionado.',
        })

        return null
      } catch (err) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Erro ao atribuir militar. Tente novamente.'

        addToast({
          type: 'error',
          title: 'Erro de Atribuição',
          description: message,
        })

        throw err
      } finally {
        setIsAssigning(false)
      }
    },
    [addToast, militaries]
  )

  return { handleAssign, isAssigning }
}
