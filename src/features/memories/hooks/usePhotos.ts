import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/db/db'
import type { Photo } from '@/features/plans/types'

export function usePhotos(planId: string): Photo[] | undefined {
  return useLiveQuery(
    () => db.photos.where('planId').equals(planId).toArray(),
    [planId],
  )
}
