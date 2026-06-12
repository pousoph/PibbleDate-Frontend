import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePlans } from '@/features/plans/hooks/usePlans'
import { PlanCard } from './PlanCard'
import { PibbleMascot } from '@/shared/components/PibbleMascot'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { Button } from '@/shared/ui/button'

const HEARTS = [
  { top: '10%', left: '8%',  size: '1.1rem', delay: '0s',   duration: '3.4s' },
  { top: '15%', right: '6%', size: '0.8rem', delay: '0.9s', duration: '2.9s' },
  { top: '55%', left: '4%',  size: '0.7rem', delay: '1.7s', duration: '3.7s' },
  { top: '70%', right: '5%', size: '0.9rem', delay: '0.4s', duration: '2.6s' },
  { top: '40%', left: '12%', size: '0.6rem', delay: '2.1s', duration: '3.1s' },
]

function EmptyState() {
  const rm = useReducedMotion()

  return (
    <div className="relative flex flex-col items-center gap-5 py-16 text-center min-h-[340px]">
      {/* Corazones flotantes — CSS animation, respeta CSS prefers-reduced-motion */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {HEARTS.map((h, i) => (
          <span
            key={i}
            className="absolute text-primary animate-float-heart select-none"
            style={{
              top: h.top,
              left: 'left' in h ? (h as { left: string }).left : undefined,
              right: 'right' in h ? (h as { right: string }).right : undefined,
              fontSize: h.size,
              animationDelay: h.delay,
              animationDuration: h.duration,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Mascota con halo blush */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        initial={rm ? false : { scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
      >
        <div
          className="absolute rounded-full bg-secondary/60"
          style={{ width: '168px', height: '168px' }}
          aria-hidden="true"
        />
        <PibbleMascot className="relative w-32 h-32" />
      </motion.div>

      {/* Texto */}
      <motion.div
        className="relative z-10 space-y-1.5"
        initial={rm ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.32, ease: 'easeOut' }}
      >
        <p className="font-display text-lg font-semibold text-foreground">
          Todavía no hay planes
        </p>
        <p className="text-sm text-muted-foreground max-w-[18rem] mx-auto leading-relaxed">
          Este Pibble está listo para la aventura. Crea tu primer plan y empieza a hacer historia juntos.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="relative z-10"
        initial={rm ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.5, ease: 'easeOut' }}
      >
        <Button asChild>
          <Link to="/nuevo">Crear mi primer plan</Link>
        </Button>
      </motion.div>
    </div>
  )
}

function ListContent() {
  const rm = useReducedMotion()
  const plans = usePlans()

  if (plans === undefined) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite">
        <span className="text-sm text-muted-foreground">Cargando tus planes…</span>
      </div>
    )
  }

  if (plans.length === 0) return <EmptyState />

  return (
    <motion.ul className="space-y-3" aria-label="Lista de planes">
      <AnimatePresence initial={false}>
        {plans.map((plan, i) => (
          <motion.li
            key={plan.id}
            layout
            initial={rm ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={rm ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
            transition={{
              duration: 0.22,
              delay: rm ? 0 : Math.min(i * 0.055, 0.3),
              ease: 'easeOut',
              layout: { duration: 0.22, ease: 'easeInOut' },
            }}
          >
            <PlanCard plan={plan} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}

function ErrorFallback() {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-display text-lg font-semibold">Algo salió mal</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        No pudimos cargar tus planes. Recarga la página para intentarlo de nuevo.
      </p>
    </div>
  )
}

export function PlanList() {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-0.5">
            Tu espacio ♥
          </p>
          <h1 className="font-display text-2xl font-semibold leading-none">
            Mis planes
          </h1>
        </div>
        <Button asChild size="sm">
          <Link to="/nuevo">
            <Plus className="size-4 mr-1" aria-hidden="true" />
            Nuevo plan
          </Link>
        </Button>
      </div>

      <ErrorBoundary fallback={<ErrorFallback />}>
        <ListContent />
      </ErrorBoundary>
    </section>
  )
}
