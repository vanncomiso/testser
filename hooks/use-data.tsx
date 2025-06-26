import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import type { Database } from '@/lib/supabase'

type DataItem = Database['public']['Tables']['data']['Row']
type DataInsert = Database['public']['Tables']['data']['Insert']
type DataUpdate = Database['public']['Tables']['data']['Update']
type DataType = 'context' | 'issue' | 'inquiry' | 'product'

interface UseDataReturn {
  data: DataItem[]
  loading: boolean
  error: string | null
  createData: (data: Omit<DataInsert, 'user_id'>) => Promise<{ data: DataItem | null; error: string | null }>
  updateData: (id: string, updates: DataUpdate) => Promise<{ data: DataItem | null; error: string | null }>
  deleteData: (id: string) => Promise<{ error: string | null }>
  getDataByProject: (projectId: string, type?: DataType) => Promise<{ data: DataItem[] | null; error: string | null }>
  refreshData: () => Promise<void>
}

export function useData(projectId?: string, type?: DataType): UseDataReturn {
  const { user } = useAuth()
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user) {
      setData([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('data')
        .select('*')
        .eq('user_id', user.id)

      // Filter by project if provided
      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      // Filter by type if provided
      if (type) {
        query = query.eq('type', type)
      }

      const { data: fetchedData, error: fetchError } = await query
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setData(fetchedData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createData = async (dataItem: Omit<DataInsert, 'user_id'>) => {
    if (!user) {
      return { data: null, error: 'User not authenticated' }
    }

    try {
      const { data: createdData, error: createError } = await supabase
        .from('data')
        .insert({
          ...dataItem,
          user_id: user.id,
        })
        .select()
        .single()

      if (createError) {
        throw createError
      }

      // Update local state
      setData(prev => [createdData, ...prev])

      return { data: createdData, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create data'
      return { data: null, error: errorMessage }
    }
  }

  const updateData = async (id: string, updates: DataUpdate) => {
    try {
      const { data: updatedData, error: updateError } = await supabase
        .from('data')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      // Update local state
      setData(prev => 
        prev.map(item => 
          item.id === id ? updatedData : item
        )
      )

      return { data: updatedData, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update data'
      return { data: null, error: errorMessage }
    }
  }

  const deleteData = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('data')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Update local state
      setData(prev => prev.filter(item => item.id !== id))

      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete data'
      return { error: errorMessage }
    }
  }

  const getDataByProject = async (projectId: string, type?: DataType) => {
    try {
      let query = supabase
        .from('data')
        .select('*')
        .eq('project_id', projectId)

      if (type) {
        query = query.eq('type', type)
      }

      const { data: fetchedData, error: fetchError } = await query
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      return { data: fetchedData, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      return { data: null, error: errorMessage }
    }
  }

  const refreshData = async () => {
    await fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [user, projectId, type])

  return {
    data,
    loading,
    error,
    createData,
    updateData,
    deleteData,
    getDataByProject,
    refreshData,
  }
}