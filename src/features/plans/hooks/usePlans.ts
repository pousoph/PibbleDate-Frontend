import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/db/db'

export function usePlans() {
  return useLiveQuery(() => db.plans.orderBy('createdAt').toArray())
}
