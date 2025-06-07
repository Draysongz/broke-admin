import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminApi } from '@/lib/api'
import { Users, Wallet, CreditCard, Activity } from 'lucide-react'

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['systemStats'],
    queryFn: () => adminApi.getSystemStats()
  })

  if(stats) console.log(stats);

  if (isLoading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium animate-pulse bg-muted h-4 w-24' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold animate-pulse bg-muted h-8 w-32' />
              <p className='text-muted-foreground text-xs animate-pulse bg-muted h-3 w-24 mt-2' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
          <Users className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats?.totalUsers || 0}</div>
          <p className='text-muted-foreground text-xs'>
            Registered users
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Transactions</CardTitle>
          <CreditCard className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats?.totalTransactions || 0}</div>
          <p className='text-muted-foreground text-xs'>
            All time transactions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Pending Transactions</CardTitle>
          <Activity className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats?.pendingTransactions || 0}</div>
          <p className='text-muted-foreground text-xs'>
            Awaiting approval
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
          <Wallet className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {stats?.totalBalances?.brokecoin || 0} BC
          </div>
          <p className='text-muted-foreground text-xs'>
            {stats?.totalBalances?.chips || 0} Chips
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 