import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/db/db'
import type { DatePlan } from '@/features/plans/types'

// undefined = loading · null = no encontrado · DatePlan = encontrado
export function usePlan(id: string): DatePlan | null | undefined {
  return useLiveQuery(async () => {
    const plan = await db.plans.get(id)
    return plan ?? null
  }, [id])
}
