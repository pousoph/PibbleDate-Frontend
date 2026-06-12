import { useMemo } from 'react'
import { usePlans } from '@/features/plans/hooks/usePlans'
import type { DatePlan } from '@/features/plans/types'

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'] as const

function monthKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MONTHS_ES[m - 1]} '${String(y).slice(-2)}`
}

export interface PlansByMonthDatum { key: string; label: string; count: number }
export interface SpendByMonthDatum  { key: string; label: string; total: number }
export interface CategoryDatum      { category: string; count: number }
export interface RatingDatum        { label: string; stars: number; count: number }

export interface InsightsData {
  totalPlans:     number
  completedPlans: number
  totalBudget:    number
  avgRating:      number | null
  plansByMonth:   PlansByMonthDatum[]
  spendByMonth:   SpendByMonthDatum[]
  topCategories:  CategoryDatum[]
  ratingDist:     RatingDatum[]
}

function derive(plans: DatePlan[]): InsightsData {
  const completed = plans.filter(p => p.status === 'completed')

  const totalBudget = completed
    .filter(p => p.estimatedBudget != null)
    .reduce((s, p) => s + p.estimatedBudget!, 0)

  const ratedPlans = completed.filter(p => p.rating && p.rating > 0)
  const avgRating  = ratedPlans.length
    ? +(ratedPlans.reduce((s, p) => s + p.rating!, 0) / ratedPlans.length).toFixed(1)
    : null

  // Plans per month — all plans by createdAt
  const pmMap = new Map<string, number>()
  for (const p of plans) {
    const k = monthKey(p.createdAt)
    pmMap.set(k, (pmMap.get(k) ?? 0) + 1)
  }
  const plansByMonth = [...pmMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ key, label: monthLabel(key), count }))

  // Spend per month — completed with budget, by plannedFor or updatedAt
  const smMap = new Map<string, number>()
  for (const p of completed) {
    if (p.estimatedBudget == null) continue
    const k = monthKey(p.plannedFor ?? p.updatedAt)
    smMap.set(k, (smMap.get(k) ?? 0) + p.estimatedBudget)
  }
  const spendByMonth = [...smMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => ({ key, label: monthLabel(key), total }))

  // Top categories — all plans
  const catMap = new Map<string, number>()
  for (const p of plans) {
    if (!p.category) continue
    catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1)
  }
  const topCategories = [...catMap.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([category, count]) => ({ category, count }))

  // Rating distribution — completed plans
  const ratingDist = [1, 2, 3, 4, 5].map((stars) => ({
    label: `${stars}★`,
    stars,
    count: completed.filter(p => p.rating === stars).length,
  }))

  return {
    totalPlans: plans.length,
    completedPlans: completed.length,
    totalBudget,
    avgRating,
    plansByMonth,
    spendByMonth,
    topCategories,
    ratingDist,
  }
}

export function useInsightsData(): InsightsData | undefined {
  const plans = usePlans()
  return useMemo(() => {
    if (plans === undefined) return undefined
    return derive(plans)
  }, [plans])
}
