import { useState } from 'react'
import { plansRepo } from '@/shared/db/plansRepo'
import type { DatePlan } from '@/features/plans/types'

// id y timestamps son opcionales: ausentes = crear, presentes = editar
type PlanInput = Omit<DatePlan, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string
  createdAt?: number
}

export function useUpsertPlan() {
  const [isPending, setIsPending] = useState(false)

  const upsert = async (input: PlanInput) => {
    setIsPending(true)
    try {
      const now = Date.now()
      const plan: DatePlan = {
        ...input,
        id:        input.id        ?? crypto.randomUUID(),
        createdAt: input.createdAt ?? now,
        updatedAt: now,
      }
      await plansRepo.upsert(plan)
    } finally {
      setIsPending(false)
    }
  }

  return { upsert, isPending }
}
