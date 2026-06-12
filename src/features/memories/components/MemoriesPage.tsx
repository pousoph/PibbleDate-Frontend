import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Download, Upload } from 'lucide-react'
import { useMemories } from '../hooks/useMemories'
import { MemoryCard } from './MemoryCard'
import { plansRepo } from '@/shared/db/plansRepo'
import { photosRepo } from '@/shared/db/photosRepo'
import { db } from '@/shared/db/db'
import { blobToDataUrl, dataUrlToBlob } from '@/shared/lib/imageUtils'
import { PibbleMascot } from '@/shared/components/PibbleMascot'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { Button } from '@/shared/ui/button'

/* ── Export / Import ── */

async function exportBackup() {
  const plans = await plansRepo.list()
  const allPhotos = await photosRepo.listAll()

  const photosData = await Promise.all(
    allPhotos.map(async ({ blob, ...rest }) => ({
      ...rest,
      data: await blobToDataUrl(blob),
    })),
  )

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    plans,
    photos: photosData,
  }

  const fileBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
  const url = URL.createObjectURL(fileBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pibble-date-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

type ImportResult = { plans: number; photos: number }

async function importBackup(file: File): Promise<ImportResult> {
  const text = await file.text()
  const payload = JSON.parse(text)

  if (!Array.isArray(payload.plans)) throw new Error('Formato de archivo inválido')

  let planCount = 0
  for (const plan of payload.plans) {
    const existing = await plansRepo.get(plan.id)
    if (!existing) {
      await plansRepo.upsert(plan)
      planCount++
    }
  }

  let photoCount = 0
  for (const p of payload.photos ?? []) {
    const existing = await db.photos.get(p.id)
    if (!existing && p.data) {
      const blob = dataUrlToBlob(p.data)
      await photosRepo.add({ id: p.id, planId: p.planId, blob, createdAt: p.createdAt })
      photoCount++
    }
  }

  return { plans: planCount, photos: photoCount }
}

/* ── Empty state ── */

function EmptyMemories() {
  const rm = useReducedMotion()
  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center">
      <motion.div
        initial={rm ? false : { scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
        className="relative"
      >
        <div
          className="absolute rounded-full bg-secondary/60"
          style={{ width: '140px', height: '140px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
          aria-hidden="true"
        />
        <PibbleMascot className="relative w-28 h-28" />
      </motion.div>

      <motion.div
        className="space-y-1.5"
        initial={rm ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.32, ease: 'easeOut' }}
      >
        <p className="font-display text-lg font-semibold">Todavía no hay recuerdos</p>
        <p className="text-sm text-muted-foreground max-w-[18rem] mx-auto leading-relaxed">
          Cuando marques una cita como "vivida" podrás guardar la calificación, notas y fotos aquí.
        </p>
      </motion.div>
    </div>
  )
}

/* ── Content ── */

function MemoriesContent() {
  const memories = useMemories()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportBackup()
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsImporting(true)
    setImportResult(null)
    setImportError(null)
    try {
      const result = await importBackup(file)
      setImportResult(result)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Error al importar el archivo')
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (memories === undefined) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite">
        <span className="text-sm text-muted-foreground">Cargando recuerdos…</span>
      </div>
    )
  }

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-0.5">
            Tu historia ♥
          </p>
          <h1 className="font-display text-2xl font-semibold leading-none">
            Recuerdos
          </h1>
        </div>

        {/* Acciones de backup */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            aria-label="Exportar backup"
            title="Exportar backup"
          >
            <Download className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only sm:ml-1.5">
              {isExporting ? 'Exportando…' : 'Exportar'}
            </span>
          </Button>

          <label
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            title="Importar backup"
          >
            <Upload className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">
              {isImporting ? 'Importando…' : 'Importar'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={handleImportFile}
              disabled={isImporting}
              aria-label="Importar backup JSON"
            />
          </label>
        </div>
      </div>

      {/* Feedback import */}
      {importResult && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-3 rounded-xl bg-[var(--c-success)]/10 text-sm text-[var(--c-success)] border border-[var(--c-success)]/20"
          role="status"
        >
          Importado: {importResult.plans} plan{importResult.plans !== 1 ? 'es' : ''}{importResult.photos > 0 ? ` y ${importResult.photos} foto${importResult.photos !== 1 ? 's' : ''}` : ''}.
        </motion.div>
      )}

      {importError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 text-sm text-destructive border border-destructive/20"
          role="alert"
        >
          {importError}
        </motion.div>
      )}

      {memories.length === 0 ? (
        <EmptyMemories />
      ) : (
        <ul className="space-y-3" aria-label="Lista de recuerdos">
          {memories.map((plan, i) => (
            <li key={plan.id}>
              <MemoryCard plan={plan} index={i} />
            </li>
          ))}
        </ul>
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
        No pudimos cargar tus recuerdos. Recarga la página para intentarlo de nuevo.
      </p>
    </div>
  )
}

/* ── Export ── */

export function MemoriesPage() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MemoriesContent />
    </ErrorBoundary>
  )
}
