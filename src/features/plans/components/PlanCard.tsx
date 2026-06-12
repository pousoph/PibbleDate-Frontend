import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, MapPin, Tag } from 'lucide-react'
import type { DatePlan, DateStatus } from '@/features/plans/types'
import { formatDate } from '@/shared/lib/utils'
import { StatusBadge } from './StatusBadge'

const statusAccent: Record<DateStatus, string> = {
  idea:      'var(--accent-lilac)',
  planned:   'var(--accent-peach)',
  completed: 'var(--brand)',
}

interface PlanCardProps {
  plan: DatePlan
}

export function PlanCard({ plan }: PlanCardProps) {
  const navigate = useNavigate()
  const rm = useReducedMotion()

  const hasMeta = plan.plannedFor ?? plan.location ?? plan.category

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(`/plan/${plan.id}`)
    }
  }

  return (
    <motion.article
      onClick={() => navigate(`/plan/${plan.id}`)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${plan.title}`}
      className="relative overflow-hidden bg-card border border-border rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
      whileHover={rm ? {} : { y: -2 }}
      whileTap={rm   ? {} : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      {/* Barra de acento de estado */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: statusAccent[plan.status] }}
      />

      <div className="p-4 pl-5">
        {/* Fila principal: título + badge */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-[1.0625rem] font-semibold leading-snug text-foreground">
            {plan.title}
          </h2>
          <StatusBadge status={plan.status} className="shrink-0 mt-0.5" />
        </div>

        {/* Meta — solo renderiza si al menos un campo existe */}
        {hasMeta && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {plan.plannedFor && (
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {formatDate(plan.plannedFor)}
              </span>
            )}
            {plan.location && (
              <span className="flex items-center gap-1 min-w-0">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{plan.location}</span>
              </span>
            )}
            {plan.category && (
              <span className="flex items-center gap-1">
                <Tag className="size-3.5" aria-hidden="true" />
                {plan.category}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}
