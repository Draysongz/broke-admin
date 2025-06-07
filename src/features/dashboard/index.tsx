import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { StatsCards } from './components/stats-cards'

export default function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Export Data</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='users'>Users</TabsTrigger>
              <TabsTrigger value='transactions'>Transactions</TabsTrigger>
              <TabsTrigger value='tasks'>Tasks</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <StatsCards />
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest transactions in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='users' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage user accounts and balances
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Users table will go here */}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='transactions' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  View and manage all transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Transactions table will go here */}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='tasks' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Manage admin tasks and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Tasks table will go here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Users',
    href: '/users',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Tasks',
    href: '/tasks',
    isActive: false,
    disabled: false,
  },
]
