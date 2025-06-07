import { ColumnDef } from '@tanstack/react-table'
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

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className='w-[100px] truncate'>{row.getValue('id')}</div>,
    meta: { className: 'w-[100px]' }
  },
  {
    accessorKey: 'user_id',
    header: 'User',
    cell: ({ row }) => <div className='w-[100px] truncate'>{row.getValue('user_id')}</div>,
    meta: { className: 'w-[100px]' }
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <div className='w-[150px]'>
          {TRANSACTION_TYPE_LABELS[type as keyof typeof TRANSACTION_TYPE_LABELS] || type}
        </div>
      )
    },
    meta: { className: 'w-[150px]' }
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      const currency = row.getValue('currency') as string
      return (
        <div className='w-[120px] font-medium'>
          {CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || ''}
          {amount}
        </div>
      )
    },
    meta: { className: 'w-[120px]' }
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    cell: ({ row }) => <div className='w-[100px]'>{row.getValue('currency')}</div>,
    meta: { className: 'w-[100px]' }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      )
    },
    meta: { className: 'w-[100px]' }
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return <div className='w-[150px]'>{formatDistanceToNow(date, { addSuffix: true })}</div>
    },
    meta: { className: 'w-[150px]' }
  },
  {
    accessorKey: 'confirmed_at',
    header: 'Confirmed',
    cell: ({ row }) => {
      const date = row.getValue('confirmed_at') as string | null
      if (!date) return <div className='w-[150px]'>-</div>
      return <div className='w-[150px]'>{formatDistanceToNow(new Date(date), { addSuffix: true })}</div>
    },
    meta: { className: 'w-[150px]' }
  }
] 