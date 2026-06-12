import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/db/db'
import type { DatePlan } from '@/features/plans/types'

export function useMemories(): DatePlan[] | undefined {
  return useLiveQuery(
    () =>
      db.plans
        .where('status')
        .equals('completed')
        .sortBy('updatedAt')
        .then((plans) => plans.reverse()),
  )
}
