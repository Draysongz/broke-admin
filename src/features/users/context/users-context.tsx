import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
export interface User {
  id: string
  username: string
  email: string
  role: string
  wallet_address?: string
  chips_balance?: number
  brokecoin_balance?: number
  created_at: string
  updated_at: string
  status?: 'active' | 'inactive' | 'invited' | 'suspended'
}
import { create } from 'zustand'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface UsersContextType {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

interface UsersState {
  showAddUserDialog: boolean
  setShowAddUserDialog: (show: boolean) => void
  showEditUserDialog: boolean
  setShowEditUserDialog: (show: boolean) => void
  showDeleteUserDialog: boolean
  setShowDeleteUserDialog: (show: boolean) => void
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
}

export const useUsersStore = create<UsersState>((set) => ({
  showAddUserDialog: false,
  setShowAddUserDialog: (show) => set({ showAddUserDialog: show }),
  showEditUserDialog: false,
  setShowEditUserDialog: (show) => set({ showEditUserDialog: show }),
  showDeleteUserDialog: false,
  setShowDeleteUserDialog: (show) => set({ showDeleteUserDialog: show }),
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user })
}))

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  return (
    <UsersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
