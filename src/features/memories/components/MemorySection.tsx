import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { plansRepo } from '@/shared/db/plansRepo'
import { photosRepo } from '@/shared/db/photosRepo'
import { compressImage } from '@/shared/lib/imageUtils'
import { PibbleMascot } from '@/shared/components/PibbleMascot'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { StarRating } from './StarRating'
import { PhotoGrid } from './PhotoGrid'
import { usePhotos } from '../hooks/usePhotos'
import type { DatePlan } from '@/features/plans/types'

interface MemorySectionProps {
  plan: DatePlan
}

export function MemorySection({ plan }: MemorySectionProps) {
  const rm = useReducedMotion()
  const [rating, setRating] = useState(plan.rating ?? 0)
  const [memoryNote, setMemoryNote] = useState(plan.memoryNote ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photos = usePhotos(plan.id)

  // Re-sync when navigating to a different completed plan
  useEffect(() => {
    setRating(plan.rating ?? 0)
    setMemoryNote(plan.memoryNote ?? '')
  }, [plan.id])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await plansRepo.upsert({
        ...plan,
        rating: rating || undefined,
        memoryNote: memoryNote.trim() || undefined,
        updatedAt: Date.now(),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const blob = await compressImage(file)
      const photoId = crypto.randomUUID()
      await photosRepo.add({ id: photoId, planId: plan.id, blob, createdAt: Date.now() })
      const currentIds = plan.photoIds ?? []
      await plansRepo.upsert({
        ...plan,
        photoIds: [...currentIds, photoId],
        updatedAt: Date.now(),
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    await photosRepo.remove(photoId)
    await plansRepo.upsert({
      ...plan,
      photoIds: (plan.photoIds ?? []).filter((id) => id !== photoId),
      updatedAt: Date.now(),
    })
  }

  return (
    <motion.section
      aria-label="Tu recuerdo"
      initial={rm ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.08 }}
      className="rounded-2xl border border-secondary bg-secondary/30 p-5 space-y-5"
    >
      {/* Header con mascota */}
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <PibbleMascot className="w-12 h-12" />
        </div>
        <div>
          <p className="font-display text-base font-semibold text-secondary-foreground leading-tight">
            Guarda tu recuerdo
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            ¿Cómo fue esta cita?
          </p>
        </div>
      </div>

      {/* Calificación */}
      <div className="space-y-1.5">
        <label className="text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase">
          Calificación
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Nota */}
      <div className="space-y-1.5">
        <label
          htmlFor={`memory-note-${plan.id}`}
          className="text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase"
        >
          Nota del recuerdo
        </label>
        <Textarea
          id={`memory-note-${plan.id}`}
          value={memoryNote}
          onChange={(e) => setMemoryNote(e.target.value)}
          placeholder="¿Qué fue lo mejor? ¿Qué quieres recordar…"
          rows={3}
          className="resize-none bg-background/70 text-sm"
        />
      </div>

      {/* Fotos */}
      <div className="space-y-2">
        <p className="text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase">
          Fotos
        </p>
        <PhotoGrid photos={photos} onDelete={handleDeletePhoto} />
        <label className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-sm cursor-pointer hover:bg-muted transition-colors text-foreground">
          <Camera className="size-4 text-muted-foreground" aria-hidden="true" />
          {isUploading ? 'Subiendo…' : 'Añadir foto'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handlePhotoUpload}
            disabled={isUploading}
            aria-label="Añadir foto al recuerdo"
          />
        </label>
      </div>

      {/* Guardar */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        variant="outline"
        className="w-full border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary/60"
      >
        {saved ? '¡Recuerdo guardado ♥!' : isSaving ? 'Guardando…' : 'Guardar recuerdo'}
      </Button>
    </motion.section>
  )
}
