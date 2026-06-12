import { cn } from '@/shared/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: 'sm' | 'md'
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  return (
    <div
      className="flex gap-0.5"
      role={readonly ? undefined : 'group'}
      aria-label={readonly ? `${value} de 5 estrellas` : 'Calificación (1–5 estrellas)'}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
          aria-pressed={!readonly ? star <= value : undefined}
          className={cn(
            'transition-transform select-none',
            size === 'md' ? 'text-2xl leading-none' : 'text-base leading-none',
            readonly
              ? 'cursor-default'
              : 'hover:scale-125 active:scale-95 cursor-pointer',
            star <= value
              ? 'text-[var(--c-warning)]'
              : 'text-[var(--line)]',
          )}
        >
          ★
        </button>
      ))}
    </div>
  )
}
