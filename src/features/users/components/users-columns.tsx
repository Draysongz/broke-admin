import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableRowActions } from './data-table-row-actions'
import { formatDistanceToNow } from 'date-fns'

export const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => <div className='w-[150px]'>{row.getValue('username')}</div>,
    meta: { className: 'w-[150px]' }
  },
  {
    accessorKey: 'wallet_address',
    header: 'Wallet Address',
    cell: ({ row }) => <div className='w-[300px] truncate font-mono'>{row.getValue('wallet_address')}</div>,
    meta: { className: 'w-[300px]' }
  },
  {
    accessorKey: 'chips_balance',
    header: 'Chips Balance',
    cell: ({ row }) => <div className='w-[120px] font-medium'>🎰 {row.getValue('chips_balance')}</div>,
    meta: { className: 'w-[120px]' }
  },
  {
    accessorKey: 'brokecoin_balance',
    header: 'Brokecoin Balance',
    cell: ({ row }) => <div className='w-[120px] font-medium'>₿ {row.getValue('brokecoin_balance')}</div>,
    meta: { className: 'w-[120px]' }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return (
        <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
          {role || 'user'}
        </Badge>
      )
    },
    meta: { className: 'w-[100px]' }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
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
    accessorKey: 'last_login',
    header: 'Last Login',
    cell: ({ row }) => {
      const date = row.getValue('last_login')
      if (!date) return <div className='w-[150px]'>-</div>
      return <div className='w-[150px]'>{formatDistanceToNow(date as string, { addSuffix: true })}</div>
    },
    meta: { className: 'w-[150px]' }
  },
 
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
