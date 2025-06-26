"use client"

import * as React from "react"
import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useData } from '@/hooks/use-data'
import { useProjects } from '@/hooks/use-projects'
import { SearchAndFilters } from './knowledge-base/search-and-filters'
import { DataCard } from './knowledge-base/data-card'
import { CreateDataModal } from './knowledge-base/create-data-modal'
import { EmptyState } from './knowledge-base/empty-state'
import { filterAndSortData } from './knowledge-base/utils'
import { FilterState, CreateDataFormData } from './knowledge-base/types'

export function KnowledgeBase() {
  const { projects } = useProjects()
  const { data, loading, createData } = useData()
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'context',
    sortBy: 'newest'
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredData = filterAndSortData(data, filters)
  const hasFilters = filters.search !== ''

  // Get the display name for the current filter type
  const getFilterDisplayName = (type: DataType) => {
    const typeConfig = DATA_TYPES.find(t => t.id === type)
    return typeConfig?.name || 'Data'
  }

  // Get the button text based on current filter
  const getAddButtonText = () => {
    const displayName = getFilterDisplayName(filters.type)
    return `Add ${displayName}`
  }

  const handleCreateData = async (formData: CreateDataFormData) => {
    // Use the first project if available, or create a default project ID
    const projectId = projects[0]?.id || 'default-project-id'
    
    await createData({
      ...formData,
      project_id: projectId
    })
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'context',
      sortBy: 'newest'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sidebar-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sidebar-foreground">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-sidebar-foreground mb-2">
                  Data Library
                </h1>
                <p className="text-sidebar-foreground/70">
                  Manage your knowledge base and training data
                </p>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90 w-full sm:w-auto"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                {getAddButtonText()}
              </Button>
            </div>

            {/* Search and Filters */}
            <SearchAndFilters
              filters={filters}
              onFiltersChange={setFilters}
              resultCount={filteredData.length}
            />

            {/* Content */}
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                {filteredData.map((item) => (
                  <DataCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                hasFilters={hasFilters}
                onClearFilters={handleClearFilters}
                onCreateData={() => setIsCreateModalOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Data Modal */}
      <CreateDataModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateData}
      />
    </div>
  )
}