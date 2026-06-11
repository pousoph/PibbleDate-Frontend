import Dexie, { type EntityTable } from 'dexie'
import type { DatePlan, Photo } from '@/features/plans/types'

class PibbleDatabase extends Dexie {
  plans!: EntityTable<DatePlan, 'id'>
  photos!: EntityTable<Photo, 'id'>

  constructor() {
    super('pibble-date')
    this.version(1).stores({
      plans:  'id, status, plannedFor, createdAt, updatedAt',
      photos: 'id, planId',
    })
  }
}

export const db = new PibbleDatabase()
