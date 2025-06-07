import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  task_type: z.enum(['social', 'daily', 'other']),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  reward_amount: z.number().min(0),
  reward_type: z.enum(['chips', 'brokecoin']),
  task_link: z.string().url().optional(),
  created_by: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string()
  }).optional(),
  completed_at: z.string().nullable().optional(),
  metadata: z.record(z.any()).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by_admin: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string()
  }).optional()
})

export type Task = z.infer<typeof taskSchema>
