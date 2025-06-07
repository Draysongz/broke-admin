import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { useState } from 'react'


export default function Users() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [roleFilter, setRoleFilter] = useState<string | undefined>()

  console.log(setRoleFilter);

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', page, pageSize, roleFilter],
    queryFn: () => adminApi.getUsers({ role: roleFilter }, page, pageSize)
  })

  const { data: admins, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admins', page, pageSize, roleFilter],
    queryFn: () => adminApi.getAdmins({ role: roleFilter }, page, pageSize)
  })

  const allUsers = [
    ...(users?.users || []).map((user: { [key: string]: any }) => ({ ...user, role: 'user' })),
    ...(admins?.users || []).map((admin: { [key: string]: any }) => ({ ...admin, role: admin.role || 'admin' }))
  ]

  const totalUsers = (users?.total || 0) + (admins?.total || 0)
  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <UsersPrimaryButtons />
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable 
            data={allUsers} 
            columns={columns} 
            isLoading={isLoadingUsers || isLoadingAdmins}
            pageCount={totalPages}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
