import { z } from 'zod'

const stepSchema = z.object({
  id:   z.string(),
  text: z.string().trim().min(1, 'El paso no puede estar vacío'),
  done: z.boolean(),
})

export const planSchema = z.object({
  title:           z.string().trim().min(1, 'El título es obligatorio'),
  description:     z.string().optional(),
  status:          z.enum(['idea', 'planned', 'completed']),
  plannedFor:      z.string().optional(),   // "YYYY-MM-DD"; convertido a epoch ms en onSubmit
  location:        z.string().optional(),
  category:        z.string().optional(),
  estimatedBudget: z.number().min(0, 'El presupuesto debe ser positivo').optional(),
  steps:           z.array(stepSchema),
  notes:           z.string().optional(),
})

export type PlanFormValues = z.infer<typeof planSchema>
