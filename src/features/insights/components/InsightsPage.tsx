import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { useInsightsData } from '../hooks/useInsightsData'
import { PlansPerMonth } from './PlansPerMonth'
import { SpendByMonth } from './SpendByMonth'
import { TopCategories } from './TopCategories'
import { RatingDistribution } from './RatingDistribution'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { PibbleMascot } from '@/shared/components/PibbleMascot'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'

/* ── KPI card ── */

interface KpiProps {
  label: string
  value: string
  sub?: string
}

function Kpi({ label, value, sub }: KpiProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-1">
      <p className="text-[0.6rem] font-bold tracking-[0.15em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-display text-2xl font-semibold text-foreground leading-none">
        {value}
      </p>
      {sub && (
        <p className="text-xs text-muted-foreground">{sub}</p>
      )}
    </div>
  )
}

/* ── Content ── */

function InsightsContent() {
  const rm = useReducedMotion()
  const data = useInsightsData()

  if (data === undefined) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite">
        <span className="text-sm text-muted-foreground">Calculando insights…</span>
      </div>
    )
  }

  const noPlans = data.totalPlans === 0

  return (
    <section>
      {/* Encabezado */}
      <div className="mb-6">
        <p className="text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-0.5">
          Tu historia en números ♥
        </p>
        <h1 className="font-display text-2xl font-semibold leading-none">Insights</h1>
      </div>

      {noPlans ? (
        /* Empty global state */
        <motion.div
          className="flex flex-col items-center gap-5 py-16 text-center"
          initial={rm ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="relative">
            <div
              className="absolute rounded-full bg-secondary/60"
              style={{ width: 140, height: 140, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
              aria-hidden="true"
            />
            <PibbleMascot className="relative w-28 h-28" />
          </div>
          <div className="space-y-1.5">
            <p className="font-display text-lg font-semibold">Aún no hay datos</p>
            <p className="text-sm text-muted-foreground max-w-[18rem] mx-auto leading-relaxed">
              Crea y completa planes para que los insights cobren vida.
            </p>
          </div>
          <Button asChild>
            <Link to="/">Crear mi primer plan</Link>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* KPI row — 2×2 on mobile, 4 col on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Kpi
              label="Planes creados"
              value={String(data.totalPlans)}
            />
            <Kpi
              label="Citas vividas"
              value={String(data.completedPlans)}
              sub={data.totalPlans > 0
                ? `${Math.round((data.completedPlans / data.totalPlans) * 100)}% del total`
                : undefined}
            />
            <Kpi
              label="Presupuesto"
              value={data.totalBudget > 0
                ? `$${data.totalBudget.toLocaleString('es')}`
                : '—'}
              sub={data.totalBudget > 0 ? 'en citas vividas' : 'sin datos aún'}
            />
            <Kpi
              label="Rating promedio"
              value={data.avgRating != null ? `${data.avgRating}★` : '—'}
              sub={data.avgRating != null ? 'de 5 posibles' : 'sin calificaciones'}
            />
          </div>

          {/* Charts */}
          <PlansPerMonth data={data.plansByMonth} />
          <SpendByMonth data={data.spendByMonth} />

          <div className="grid sm:grid-cols-2 gap-4">
            <TopCategories data={data.topCategories} />
            <RatingDistribution data={data.ratingDist} />
          </div>
        </motion.div>
      )}
    </section>
  )
}

/* ── Error fallback ── */

function ErrorFallback() {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-display text-lg font-semibold">Algo salió mal</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        No pudimos calcular los insights. Recarga la página para intentarlo de nuevo.
      </p>
    </div>
  )
}

/* ── Default export (required for React.lazy) ── */

export default function InsightsPage() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <InsightsContent />
    </ErrorBoundary>
  )
}
