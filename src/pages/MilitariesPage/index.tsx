import axios from 'axios'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../hooks/toast'
import { api } from '../../services/apiClient'

import { Layout } from '../../components/Layout'
import { MilitaryForm } from '../../components/MilitaryForm/MilitaryForm'
import { MilitaryTable } from '../../components/MilitaryGrid/MilitaryGrid'
import { MilitarySearch } from '../../components/MilitarySearch/MilitarySearch'

import { format, parseISO } from 'date-fns'
import { MainContent } from './styles'
import type { Military, MilitaryFormData } from './types'

export const MilitariesPage: React.FC = () => {
  const { addToast } = useToast()

  const [allMilitaries, setAllMilitaries] = useState<Military[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [editingMilitaryId, setEditingMilitaryId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const totalPages = useMemo(() => {
    return Math.ceil(allMilitaries.length / itemsPerPage)
  }, [allMilitaries])

  const displayedMilitaries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allMilitaries.slice(startIndex, endIndex)
  }, [allMilitaries, currentPage])

  const fetchMilitaries = useCallback(
    async (name?: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const url = name ? `/militaries?name=${encodeURIComponent(name)}` : '/militaries'
        const response = await api.get<Military[]>(url)
        setAllMilitaries(response.data)
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(`Nenhum militar encontrado ${name ? `com o nome "${name}"` : ''}.`)
          addToast({
            type: 'error',
            title: 'Erro ao Carregar',
            description: `Nenhum militar foi encontrado ou houve um erro na busca ${name ? `com o nome "${name}"` : ''}.`,
          })
        } else {
          setError('Erro ao carregar militares. Tente novamente.')
          addToast({
            type: 'error',
            title: 'Erro de Conexão',
            description: 'Não foi possível carregar os dados dos militares.',
          })
        }
        setAllMilitaries([])
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  useEffect(() => {
    fetchMilitaries(searchTerm || undefined)
  }, [fetchMilitaries, searchTerm])

  const reloadDataAndResetPage = useCallback(async () => {
    setCurrentPage(1)
    await fetchMilitaries(searchTerm || undefined)
  }, [searchTerm, fetchMilitaries])

  const handleSubmitMilitary = useCallback(
    async (data: MilitaryFormData) => {
      setIsLoading(true)

      try {
        const dataToSave = {
          name: data.name,
          rank: data.rank,
          qualification: data.qualification,
          date_of_entry: data.date_of_entry,
        }

        if (editingMilitaryId) {
          await api.put<Military>(`/militaries/${editingMilitaryId}`, dataToSave)
          addToast({
            type: 'success',
            title: 'Militar Atualizado',
            description: 'Os dados do militar foram atualizados com sucesso!',
          })
          setEditingMilitaryId(null)
        } else {
          await api.post('/militaries', dataToSave)
          addToast({
            type: 'success',
            title: 'Militar Cadastrado',
            description: 'Novo militar cadastrado com sucesso!',
          })
        }

        await reloadDataAndResetPage()
      } catch (err) {
        addToast({
          type: 'error',
          title: `Erro ao ${editingMilitaryId ? 'atualizar' : 'cadastrar'} militar`,
          description: 'Ocorreu um erro. Tente novamente ou verifique os dados.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [editingMilitaryId, addToast, reloadDataAndResetPage]
  )

  const handleEditMilitary = useCallback((military: Military) => {
    setEditingMilitaryId(military.id)
  }, [])

  const handleDeleteMilitary = useCallback(
    async (id: string) => {
      if (!window.confirm('Tem certeza que deseja deletar este militar?')) {
        return
      }
      setError(null)
      setIsLoading(true)

      try {
        await api.delete(`/militaries/${id}`)
        addToast({
          type: 'success',
          title: 'Militar Deletado',
          description: 'Militar removido com sucesso!',
        })
        await reloadDataAndResetPage()
      } catch (err) {
        setError('Erro ao deletar militar.')
        addToast({
          type: 'error',
          title: 'Erro ao Deletar',
          description: 'Não foi possível deletar o militar. Tente novamente.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, reloadDataAndResetPage]
  )

  const handleCancelEdit = useCallback(() => {
    setEditingMilitaryId(null)
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return
      setCurrentPage(page)
    },
    [currentPage, totalPages]
  )

  const initialData = useMemo(() => {
    if (!editingMilitaryId) {
      return undefined
    }
    const militaryToEdit = allMilitaries.find(m => m.id === editingMilitaryId)
    if (militaryToEdit) {
      return {
        ...militaryToEdit,
        date_of_entry: format(parseISO(militaryToEdit.date_of_entry), 'yyyy-MM-dd'),
      } as MilitaryFormData
    }
    return undefined
  }, [allMilitaries, editingMilitaryId])

  return (
    <Layout>
      <MainContent>
        {error && <p>{error}</p>}
        {isLoading && <p>Carregando...</p>}

        <h2>Gerenciar Militares</h2>

        <MilitarySearch searchTerm={searchTerm} onSearch={setSearchTerm} />

        <MilitaryTable
          militaries={displayedMilitaries}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={handleEditMilitary}
          onDelete={handleDeleteMilitary}
          isLoading={isLoading}
        />

        <h2>{editingMilitaryId ? 'Atualizar Militar' : 'Cadastrar Novo Militar'}</h2>
        <MilitaryForm
          onSubmit={handleSubmitMilitary}
          editingMilitaryId={editingMilitaryId}
          initialData={initialData}
          onCancelEdit={handleCancelEdit}
        />
      </MainContent>
    </Layout>
  )
}
