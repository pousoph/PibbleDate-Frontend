import { useState } from 'react'
import { plansRepo } from '@/shared/db/plansRepo'

export function useDeletePlan() {
  const [isPending, setIsPending] = useState(false)

  const remove = async (id: string) => {
    setIsPending(true)
    try {
      await plansRepo.remove(id)
    } finally {
      setIsPending(false)
    }
  }

  return { remove, isPending }
}
