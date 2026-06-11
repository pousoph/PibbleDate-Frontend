import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Plus } from 'lucide-react'
import { planSchema, type PlanFormValues } from '@/features/plans/schema/planSchema'
import { useUpsertPlan } from '@/features/plans/hooks/useUpsertPlan'
import type { DatePlan } from '@/features/plans/types'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Checkbox } from '@/shared/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'

interface PlanFormProps {
  plan?: DatePlan
  onSuccess?: () => void
}

export function PlanForm({ plan, onSuccess }: PlanFormProps) {
  const [newStep, setNewStep] = useState('')
  const [saved, setSaved] = useState(false)
  const { upsert, isPending } = useUpsertPlan()

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: plan
      ? {
          title:           plan.title,
          description:     plan.description      ?? '',
          status:          plan.status,
          plannedFor:      plan.plannedFor
                             ? new Date(plan.plannedFor).toISOString().split('T')[0]
                             : '',
          location:        plan.location         ?? '',
          category:        plan.category         ?? '',
          estimatedBudget: plan.estimatedBudget,
          steps:           plan.steps,
          notes:           plan.notes            ?? '',
        }
      : { title: '', status: 'idea', steps: [] },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'steps',
    keyName: 'fieldId',
  })

  const handleAddStep = () => {
    const text = newStep.trim()
    if (!text) return
    append({ id: crypto.randomUUID(), text, done: false })
    setNewStep('')
  }

  const handleToggleDone = (index: number) => {
    const steps = form.getValues('steps')
    form.setValue(
      'steps',
      steps.map((s, i) => (i === index ? { ...s, done: !s.done } : s)),
    )
  }

  const onSubmit = async (data: PlanFormValues) => {
    try {
      await upsert({
        ...data,
        plannedFor: data.plannedFor ? new Date(data.plannedFor).getTime() : undefined,
        id:         plan?.id,
        createdAt:  plan?.createdAt,
      })
      if (!plan) form.reset({ title: '', status: 'idea', steps: [] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      onSuccess?.()
    } catch {
      form.setError('root', {
        message: 'No se pudo guardar el plan. Inténtalo de nuevo.',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>

        {/* Título */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título *</FormLabel>
              <FormControl>
                <Input placeholder="¿Qué van a hacer?" autoFocus={!plan} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado + Fecha */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="planned">Planeada</SelectItem>
                    <SelectItem value="completed">Vivida</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plannedFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Cuándo?</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Cuéntame más sobre esta cita…" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lugar + Categoría + Presupuesto */}
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lugar</FormLabel>
                <FormControl>
                  <Input placeholder="¿Dónde?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                  <Input placeholder="Cena, aventura…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Presupuesto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const v = e.target.valueAsNumber
                      field.onChange(isNaN(v) ? undefined : v)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pasos */}
        <div className="space-y-3">
          <p className="text-sm font-medium leading-none">Pasos del plan</p>

          {fields.length > 0 && (
            <ul className="space-y-2">
              {fields.map((stepField, index) => (
                <li key={stepField.fieldId} className="flex items-center gap-3">
                  <Checkbox
                    id={stepField.fieldId}
                    checked={stepField.done}
                    onCheckedChange={() => handleToggleDone(index)}
                    aria-label={`Marcar "${stepField.text}" como ${stepField.done ? 'pendiente' : 'hecho'}`}
                  />
                  <label
                    htmlFor={stepField.fieldId}
                    className={cn(
                      'flex-1 text-sm cursor-pointer select-none',
                      stepField.done && 'line-through text-muted-foreground',
                    )}
                  >
                    {stepField.text}
                  </label>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Eliminar paso "${stepField.text}"`}
                    className="text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Nuevo paso…"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddStep()
                }
              }}
              aria-label="Texto del nuevo paso"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddStep}
              disabled={!newStep.trim()}
              aria-label="Agregar paso"
            >
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Notas */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas adicionales…" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feedback + Submit */}
        <div className="space-y-2">
          {saved && (
            <p role="status" className="text-sm text-success">
              ¡Plan guardado!
            </p>
          )}
          {form.formState.errors.root && (
            <p role="alert" className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Guardando…' : plan ? 'Guardar cambios' : 'Crear plan'}
          </Button>
        </div>

      </form>
    </Form>
  )
}
