"use client"

import * as React from "react"
import { DatabaseIcon, PlusIcon } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface EmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
  onCreateData: () => void
}

export function EmptyState({ hasFilters, onClearFilters, onCreateData }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <Card className="bg-sidebar-accent border-sidebar-border p-8 max-w-md mx-auto">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-sidebar-foreground text-lg font-semibold mb-2">
            No data found
          </h3>
          <p className="text-sidebar-foreground/70 mb-4">
            No data matches your current search and filter criteria.
          </p>
          <Button
            onClick={onClearFilters}
            className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
          >
            Clear Filters
            Add Data
        </Card>
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <Card className="bg-sidebar-accent border-sidebar-border p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-sidebar-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <DatabaseIcon className="h-8 w-8 text-sidebar-foreground/40" />
        </div>
        <h3 className="text-sidebar-foreground text-lg font-semibold mb-2">
          No data yet
        </h3>
        <p className="text-sidebar-foreground/70 mb-6">
          Start building your knowledge base by adding your first piece of data.
        </p>
        <Button
          onClick={onCreateData}
          className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Data
        </Button>
      </Card>
    </div>
  )
}
    )
  }
}