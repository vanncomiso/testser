"use client"

import * as React from "react"
import { useState } from "react"
import { XIcon, PlusIcon, LoaderIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DATA_TYPES } from './constants'
import { CreateDataFormData, DataType } from './types'

interface CreateDataModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateDataFormData) => Promise<void>
  defaultType?: DataType
}

export function CreateDataModal({ isOpen, onClose, onSubmit, defaultType = 'context' }: CreateDataModalProps) {
  const [formData, setFormData] = useState<CreateDataFormData>({
    title: '',
    description: '',
    content: '',
    type: defaultType,
    tags: [],
    metadata: {}
  })
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        type: defaultType,
        tags: [],
        metadata: {}
      })
      setTagInput('')
      onClose()
      toast.success('Data created successfully!')
    } catch (error) {
      toast.error('Failed to create data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Update form type when defaultType changes
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, type: defaultType }))
  }, [defaultType])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-sidebar border border-sidebar-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <h2 className="text-xl font-semibold text-sidebar-foreground">Add New Data</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sidebar-foreground font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a descriptive title"
              className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
              disabled={isSubmitting}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sidebar-foreground font-medium">
              Type *
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: DataType) => setFormData(prev => ({ ...prev, type: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATA_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sidebar-foreground font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this data"
              className="min-h-[80px] bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sidebar-foreground font-medium">
              Content
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Detailed content or information"
              className="min-h-[120px] bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sidebar-foreground font-medium">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags..."
                className="flex-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
                disabled={isSubmitting}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-sidebar-foreground/10 text-sidebar-foreground border-sidebar-foreground/20 cursor-pointer hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-sidebar-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-sidebar-foreground text-sidebar hover:bg-sidebar-foreground/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Data'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}