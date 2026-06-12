import type { DateStatus } from '@/features/plans/types'
import { cn } from '@/shared/lib/utils'

const config: Record<DateStatus, { label: string; cls: string }> = {
  idea:      { label: 'Idea',     cls: 'bg-lilac text-secondary-foreground' },
  planned:   { label: 'Planeada', cls: 'bg-peach text-secondary-foreground' },
  completed: { label: 'Vivida',   cls: 'bg-secondary text-primary' },
}

interface StatusBadgeProps {
  status: DateStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, cls } = config[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        cls,
        className,
      )}
    >
      {label}
    </span>
  )
}
