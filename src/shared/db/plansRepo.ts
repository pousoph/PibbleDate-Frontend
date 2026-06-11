import { db } from './db'
import type { DatePlan } from '@/features/plans/types'

export const plansRepo = {
  list:   ()               => db.plans.orderBy('createdAt').toArray(),
  get:    (id: string)     => db.plans.get(id),
  upsert: (plan: DatePlan) => db.plans.put(plan),
  remove: (id: string)     => db.plans.delete(id),
}
