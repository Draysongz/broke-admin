import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { TransactionsTable } from './components/transactions-table'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { useState } from 'react'

export default function Transactions() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', page, pageSize],
    queryFn: () => adminApi.getTransactions({}, page, pageSize)
  })

  return (
    <>
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
            <h2 className='text-2xl font-bold tracking-tight'>Transactions</h2>
            <p className='text-muted-foreground'>
              View and manage all transactions.
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <TransactionsTable 
            data={transactions?.transactions || []} 
            columns={columns} 
            isLoading={isLoading}
            pageCount={transactions?.total_pages || 1}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </Main>
    </>
  )
} 