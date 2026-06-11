import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/db/db'

export function usePlan(id: string) {
  return useLiveQuery(() => db.plans.get(id), [id])
}
