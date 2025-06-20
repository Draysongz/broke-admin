import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { useState } from 'react'

export default function Tasks() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', page, pageSize],
    queryFn: () => adminApi.getTasks({}, page, pageSize)
  })

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
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            data={tasks?.tasks || []} 
            columns={columns} 
            isLoading={isLoading}
            pageCount={tasks?.total_pages || 1}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
