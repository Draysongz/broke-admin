import { Button } from '@/components/ui/button'
import { useUsersStore } from '../context/users-context'

export function UsersPrimaryButtons() {
  const { setShowAddUserDialog } = useUsersStore()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setShowAddUserDialog(true)}>
        Add User
      </Button>
    </div>
  )
}
