import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from '../components/columns'
import { DataTable } from '../components/data-table'
import { TasksDialogs } from '../components/tasks-dialogs'
import { TasksPrimaryButtons } from '../components/tasks-primary-buttons'
import TasksProvider from '../context/tasks-context'
import { Task } from '../data/schema'
import { adminApi } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchTasks = async (pageNum = 1) => {
    try {
      setLoading(true)
      const response = await adminApi.getTasks({}, pageNum, 10)
      console.log('Fetched tasks:', response) // Debug log
      setTasks(response.tasks || [])
      setTotalPages(response.totalPages || 1)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching tasks:', error) // Debug log
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Add event listener for task updates
  useEffect(() => {
    const handleTaskUpdate = () => {
      fetchTasks(page)
    }

    window.addEventListener('taskUpdated', handleTaskUpdate)
    return () => {
      window.removeEventListener('taskUpdated', handleTaskUpdate)
    }
  }, [page])

  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>
              {tasks.length === 0 && !loading ? 'No tasks found. Create a new task to get started.' : 'Manage your tasks here.'}
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable<Task> 
            data={tasks} 
            columns={columns} 
            isLoading={loading}
            pageCount={totalPages}
            page={page}
            pageSize={10}
            onPageChange={fetchTasks}
            onPageSizeChange={() => {}}
          />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
} 