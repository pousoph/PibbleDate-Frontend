import { useEffect, useState } from 'react'
import type { Photo } from '@/features/plans/types'

interface PhotoGridProps {
  photos: Photo[] | undefined
  onDelete?: (id: string) => void
}

export function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  if (!photos?.length) return null

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Fotos del recuerdo">
      {photos.map((photo) => (
        <PhotoThumb
          key={photo.id}
          photo={photo}
          onDelete={onDelete ? () => onDelete(photo.id) : undefined}
        />
      ))}
    </div>
  )
}

function PhotoThumb({
  photo,
  onDelete,
}: {
  photo: Photo
  onDelete?: () => void
}) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(photo.blob)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [photo.id, photo.blob])

  if (!src) return null

  return (
    <div className="relative group" role="listitem">
      <img
        src={src}
        alt=""
        className="w-20 h-20 object-cover rounded-xl border border-border"
      />
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Eliminar foto"
          className="absolute top-1 right-1 w-5 h-5 bg-background/90 rounded-full text-destructive opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold leading-none shadow-sm"
        >
          ×
        </button>
      )}
    </div>
  )
}
