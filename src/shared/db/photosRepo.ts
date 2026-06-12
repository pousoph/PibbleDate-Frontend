import { db } from './db'
import type { Photo } from '@/features/plans/types'

export const photosRepo = {
  listByPlan:   (planId: string) => db.photos.where('planId').equals(planId).toArray(),
  listAll:      ()               => db.photos.toArray(),
  get:          (id: string)     => db.photos.get(id),
  add:          (photo: Photo)   => db.photos.put(photo),
  remove:       (id: string)     => db.photos.delete(id),
  removeByPlan: (planId: string) => db.photos.where('planId').equals(planId).delete(),
}
