import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { usePhotos } from '../hooks/usePhotos'
import { StarRating } from './StarRating'
import { formatDate } from '@/shared/lib/utils'
import type { DatePlan } from '@/features/plans/types'

interface MemoryCardProps {
  plan: DatePlan
  index: number
}

export function MemoryCard({ plan, index }: MemoryCardProps) {
  const navigate = useNavigate()
  const rm = useReducedMotion()
  const photos = usePhotos(plan.id)
  const firstPhoto = photos?.[0]

  return (
    <motion.article
      onClick={() => navigate(`/plan/${plan.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/plan/${plan.id}`)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Ver recuerdo de ${plan.title}`}
      initial={rm ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: rm ? 0 : Math.min(index * 0.055, 0.3), ease: 'easeOut' }}
      whileHover={rm ? {} : { y: -2 }}
      whileTap={rm ? {} : { scale: 0.985 }}
      className="group flex gap-4 bg-card border border-border rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
    >
      {/* Foto o placeholder */}
      <PhotoSlot photo={firstPhoto} />

      {/* Contenido */}
      <div className="flex-1 min-w-0 py-4 pr-4">
        <h2 className="font-display text-[1rem] font-semibold text-foreground leading-snug truncate">
          {plan.title}
        </h2>

        {plan.rating !== undefined && plan.rating > 0 && (
          <div className="mt-1">
            <StarRating value={plan.rating} readonly size="sm" />
          </div>
        )}

        {plan.plannedFor && (
          <p className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3" aria-hidden="true" />
            {formatDate(plan.plannedFor)}
          </p>
        )}

        {plan.memoryNote && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {plan.memoryNote}
          </p>
        )}
      </div>
    </motion.article>
  )
}

function PhotoSlot({
  photo,
}: {
  photo: { blob: Blob } | undefined
}) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!photo) return
    const url = URL.createObjectURL(photo.blob)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  if (!src) {
    return (
      <div
        className="shrink-0 w-24 bg-secondary/50 flex items-center justify-center text-2xl text-secondary select-none"
        aria-hidden="true"
      >
        ♥
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      className="shrink-0 w-24 object-cover self-stretch"
    />
  )
}
