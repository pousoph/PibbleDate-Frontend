import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { usePlans } from '@/features/plans/hooks/usePlans'
import { plansRepo } from '@/shared/db/plansRepo'
import type { DatePlan } from '@/features/plans/types'

// TODO M2: eliminar semilla y verificación
function useM1Verification() {
  const plans = usePlans()

  useEffect(() => {
    async function seed() {
      const existing = await plansRepo.list()
      if (existing.length > 0) return
      const now = Date.now()
      const dummies: DatePlan[] = [
        { id: crypto.randomUUID(), title: 'Cena romántica',    status: 'idea',      steps: [], createdAt: now, updatedAt: now },
        { id: crypto.randomUUID(), title: 'Picnic en el parque', status: 'planned', steps: [], createdAt: now, updatedAt: now },
        { id: crypto.randomUUID(), title: 'Tarde de cine',     status: 'completed', steps: [], createdAt: now, updatedAt: now },
      ]
      await Promise.all(dummies.map(plansRepo.upsert))
    }
    seed()
  }, [])

  useEffect(() => {
    if (plans !== undefined) console.log('[M1] planes en IndexedDB:', plans)
  }, [plans])

  return plans
}

export function App() {
  const plans = useM1Verification()

  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background text-foreground font-sans">
        <header className="px-6 py-4 border-b border-border">
          <h1 className="font-display text-2xl font-semibold">
            Pibble Date
          </h1>
        </header>
        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                <p className="text-muted-foreground">
                  {plans === undefined
                    ? 'Cargando…'
                    : `${plans.length} planes en IndexedDB — M1 listo.`}
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
