export type DateStatus = 'idea' | 'planned' | 'completed'

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface DatePlan {
  id: string
  title: string
  description?: string
  status: DateStatus
  plannedFor?: number
  location?: string
  category?: string
  estimatedBudget?: number
  steps: ChecklistItem[]
  notes?: string
  createdAt: number
  updatedAt: number
  // v1.1 — opcionales hasta entonces
  rating?: number
  memoryNote?: string
  photoIds?: string[]
}

export interface Photo {
  id: string
  planId: string
  blob: Blob
  createdAt: number
}
