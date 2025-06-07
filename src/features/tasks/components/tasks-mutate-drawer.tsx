import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { Task } from '../data/schema'
import { useToast } from '@/components/ui/use-toast'
import { adminApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'Done', value: 'done' },
]

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  task_type: z.enum(['social', 'daily', 'other']),
  status: z.enum([
    'pending',
    'in_progress',
    'completed',
    'cancelled',
    'backlog',
    'todo',
    'done',
  ]),
  reward_amount: z.coerce.number().min(0, 'Reward amount must be positive'),
  reward_type: z.enum(['chips', 'brokecoin']),
  task_link: z.string().url('Must be a valid URL').optional(),
})
type TasksForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow
  const { toast } = useToast()
  const { admin } = useAuthStore()

  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          ...currentRow,
          reward_amount: currentRow.reward_amount ?? 0,
          reward_type: currentRow.reward_type ?? 'chips',
          task_type: currentRow.task_type ?? 'social',
          status: currentRow.status ?? 'pending',
        }
      : {
          title: '',
          description: '',
          task_type: 'social',
          status: 'pending',
          reward_amount: 0,
          reward_type: 'chips',
          task_link: '',
        },
  })

  const onSubmit = async (data: TasksForm) => {
    try {
      if (!admin?.id) {
        toast({
          title: 'Error',
          description: 'You must be logged in to create/update tasks',
          variant: 'destructive',
        })
        return
      }

      const taskData = {
        ...data,
        created_by: {
          id: admin.id,
          username: admin.username,
          email: admin.email
        },
        metadata: null // Initialize metadata as null
      }

      if (isUpdate && currentRow) {
        await adminApi.updateTask(currentRow.id, taskData)
        toast({ title: 'Success', description: 'Task updated successfully.' })
      } else {
        await adminApi.createTask(taskData)
        toast({ title: 'Success', description: 'Task created successfully.' })
      }
      
      // Dispatch event to refresh task list
      window.dispatchEvent(new Event('taskUpdated'))
      
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Task operation failed:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save task',
        variant: 'destructive',
      })
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col gap-0 p-0'>
        <SheetHeader className='px-6 py-4 border-b'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto'>
          <Form {...form}>
            <form
              id='tasks-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-5 p-6'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter a title' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder='Enter a description' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='task_type'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Task Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select type'
                      items={[
                        { label: 'Social', value: 'social' },
                        { label: 'Daily', value: 'daily' },
                        { label: 'Other', value: 'other' },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Status</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select status'
                      items={statusOptions}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='reward_amount'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Reward Amount</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          placeholder='Enter reward amount'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='reward_type'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Reward Type</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select reward type'
                        items={[
                          { label: 'Chips', value: 'chips' },
                          { label: 'Brokecoin', value: 'brokecoin' },
                        ]}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='task_link'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Task Link</FormLabel>
                    <FormControl>
                      <Input
                        type='url'
                        placeholder='Enter task link (optional)'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <SheetFooter className='gap-2 border-t p-4'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
