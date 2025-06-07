import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

const TRANSACTION_TYPE_LABELS = {
  purchase_chips: 'Purchase Chips',
  cashout_chips: 'Cashout Chips',
  bet: 'Bet',
  win: 'Win',
  refund: 'Refund'
}

const CURRENCY_SYMBOLS = {
  brokecoin: '₿',
  chips: '🎰'
}

export function RecentSales() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: () => adminApi.getTransactions({}, 1, 5)
  })

  if (isLoading) {
    return (
      <div className='space-y-8'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex items-center'>
            <div className='space-y-1'>
              <div className='animate-pulse bg-muted h-4 w-24' />
              <div className='animate-pulse bg-muted h-3 w-32' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {transactions?.transactions.map((transaction: any) => (
        <div key={transaction.id} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={`https://avatar.vercel.sh/${transaction.user_id}.png`} alt={transaction.user_id} />
            <AvatarFallback>{transaction.user_id.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {TRANSACTION_TYPE_LABELS[transaction.type as keyof typeof TRANSACTION_TYPE_LABELS] || transaction.type}
            </p>
            <p className='text-sm text-muted-foreground'>
              {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className='ml-auto flex items-center gap-2'>
            <span className='text-sm font-medium'>
              {CURRENCY_SYMBOLS[transaction.currency as keyof typeof CURRENCY_SYMBOLS] || ''}
              {transaction.amount}
            </span>
            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
              {transaction.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
