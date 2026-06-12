import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, Tag, Wallet, Pencil, Trash2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePlan } from '@/features/plans/hooks/usePlan'
import { useDeletePlan } from '@/features/plans/hooks/useDeletePlan'
import { plansRepo } from '@/shared/db/plansRepo'
import { StatusBadge } from './StatusBadge'
import { MemorySection } from '@/features/memories/components/MemorySection'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { cn, formatDate } from '@/shared/lib/utils'
import type { DateStatus } from '@/features/plans/types'

const nextStatus: Partial<Record<DateStatus, DateStatus>> = {
  idea: 'planned',
  planned: 'completed',
}

const advanceLabel: Record<string, string> = {
  planned:   'Marcar como planeada',
  completed: 'Ya fue — marcar como vivida',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-1.5">
      {children}
    </p>
  )
}

interface DetailContentProps {
  id: string
}

function DetailContent({ id }: DetailContentProps) {
  const navigate = useNavigate()
  const plan = usePlan(id)
  const { remove, isPending: isDeleting } = useDeletePlan()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const rm = useReducedMotion()

  if (plan === undefined) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite">
        <span className="text-sm text-muted-foreground">Cargando…</span>
      </div>
    )
  }

  if (plan === null) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-display text-lg font-semibold">Plan no encontrado</p>
        <p className="text-sm text-muted-foreground">
          Este plan ya no existe, quizás fue eliminado.
        </p>
        <Button asChild variant="outline">
          <Link to="/">Volver a mis planes</Link>
        </Button>
      </div>
    )
  }

  const handleToggleStep = async (stepId: string) => {
    await plansRepo.upsert({
      ...plan,
      steps: plan.steps.map((s) =>
        s.id === stepId ? { ...s, done: !s.done } : s,
      ),
      updatedAt: Date.now(),
    })
  }

  const handleAdvanceStatus = async () => {
    const next = nextStatus[plan.status]
    if (!next) return
    await plansRepo.upsert({ ...plan, status: next, updatedAt: Date.now() })
  }

  const handleDelete = async () => {
    await remove(plan.id)
    navigate('/')
  }

  const next = nextStatus[plan.status]
  const hasMetadata = plan.plannedFor ?? plan.location ?? plan.category ?? plan.estimatedBudget

  return (
    <article className="space-y-6">

      {/* ── Encabezado ── */}
      <div className="space-y-2">
        {/* Badge animado al cambiar de estado */}
        {rm ? (
          <StatusBadge status={plan.status} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={plan.status}
              className="inline-block"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <StatusBadge status={plan.status} />
            </motion.div>
          </AnimatePresence>
        )}
        <h1 className="font-display text-2xl font-semibold leading-tight">
          {plan.title}
        </h1>
      </div>

      {/* ── Avanzar estado / Recuerdo — comparten el mismo slot con layout ── */}
      <AnimatePresence mode="wait" initial={false}>
        {next ? (
          <motion.div
            key="advance"
            layout
            initial={rm ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={rm ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="bg-muted rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <SectionLabel>Siguiente paso</SectionLabel>
              <p className="text-sm text-foreground">¿Lista para continuar?</p>
            </div>
            <Button onClick={handleAdvanceStatus} size="sm" className="shrink-0 self-start sm:self-auto">
              {advanceLabel[next]}
              <ArrowRight className="size-4 ml-1.5" aria-hidden="true" />
            </Button>
          </motion.div>
        ) : plan.status === 'completed' ? (
          <motion.div
            key="completed"
            layout
            initial={rm ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="bg-secondary rounded-xl p-4 text-center"
          >
            <p className="text-sm font-semibold text-secondary-foreground">
              Esta cita ya es un recuerdo ♥
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Descripción ── */}
      {plan.description && (
        <p className="text-foreground leading-relaxed">{plan.description}</p>
      )}

      {/* ── Metadata como chips ── */}
      {hasMetadata && (
        <dl className="flex flex-wrap gap-2">
          {plan.plannedFor && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm">
              <CalendarDays className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Fecha</dt>
              <dd>{formatDate(plan.plannedFor)}</dd>
            </div>
          )}
          {plan.location && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm">
              <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Lugar</dt>
              <dd>{plan.location}</dd>
            </div>
          )}
          {plan.category && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm">
              <Tag className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Categoría</dt>
              <dd>{plan.category}</dd>
            </div>
          )}
          {plan.estimatedBudget !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm">
              <Wallet className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Presupuesto estimado</dt>
              <dd>${plan.estimatedBudget.toLocaleString('es')}</dd>
            </div>
          )}
        </dl>
      )}

      {/* ── Checklist de pasos ── */}
      {plan.steps.length > 0 && (
        <div>
          <SectionLabel>Pasos del plan</SectionLabel>
          <ul className="space-y-2.5 bg-card border border-border rounded-xl p-4">
            {plan.steps.map((step, idx) => (
              <li key={step.id} className={cn('flex items-center gap-3', idx > 0 && 'pt-2.5 border-t border-border')}>
                <Checkbox
                  id={`step-${step.id}`}
                  checked={step.done}
                  onCheckedChange={() => handleToggleStep(step.id)}
                  aria-label={`Marcar "${step.text}" como ${step.done ? 'pendiente' : 'hecho'}`}
                />
                <label
                  htmlFor={`step-${step.id}`}
                  className={cn(
                    'flex-1 text-sm cursor-pointer select-none',
                    step.done && 'line-through text-muted-foreground',
                  )}
                >
                  {step.text}
                </label>
              </li>
            ))}
          </ul>
          {/* Progreso */}
          {plan.steps.length > 1 && (
            <p className="text-xs text-muted-foreground mt-2 pl-1">
              {plan.steps.filter(s => s.done).length} de {plan.steps.length} completados
            </p>
          )}
        </div>
      )}

      {/* ── Notas ── */}
      {plan.notes && (
        <div>
          <SectionLabel>Notas</SectionLabel>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-card border border-border rounded-xl p-4">
            {plan.notes}
          </p>
        </div>
      )}

      {/* ── Recuerdo (v1.1) — solo cuando está completada ── */}
      <AnimatePresence>
        {plan.status === 'completed' && (
          <MemorySection key="memory" plan={plan} />
        )}
      </AnimatePresence>

      {/* ── Acciones ── */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-border">
        <Button asChild variant="outline">
          <Link to={`/plan/${plan.id}/editar`}>
            <Pencil className="size-4 mr-1.5" aria-hidden="true" />
            Editar
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {!confirmDelete ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="size-4 mr-1.5" aria-hidden="true" />
              Eliminar
            </Button>
          ) : (
            <div className="flex items-center gap-2" role="group" aria-label="Confirmar eliminación">
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Eliminando…' : 'Sí, eliminar'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

    </article>
  )
}

function ErrorFallback() {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-display text-lg font-semibold">Algo salió mal</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        No pudimos cargar este plan. Intenta de nuevo.
      </p>
      <Button asChild variant="outline">
        <Link to="/">Volver a mis planes</Link>
      </Button>
    </div>
  )
}

interface PlanDetailProps {
  id: string
}

export function PlanDetail({ id }: PlanDetailProps) {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <DetailContent id={id} />
    </ErrorBoundary>
  )
}
