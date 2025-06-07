import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUsersStore } from '../context/users-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import React from 'react'

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  wallet_address: z.string().min(1, 'Wallet address is required'),
  role: z.enum(['user', 'admin', 'superadmin']),
  chips_balance: z.number(),
  brokecoin_balance: z.number()
})

type UserFormValues = z.infer<typeof userSchema>

export function UsersDialogs() {
  const { 
    showAddUserDialog, 
    setShowAddUserDialog,
    showEditUserDialog,
    setShowEditUserDialog,
    showDeleteUserDialog,
    setShowDeleteUserDialog,
    selectedUser,
    setSelectedUser
  } = useUsersStore()
  const queryClient = useQueryClient()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      wallet_address: '',
      role: 'user',
      chips_balance: 0,
      brokecoin_balance: 0
    }
  })

  // Reset form when selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      form.reset({
        username: selectedUser.username || '',
        wallet_address: selectedUser.wallet_address || '',
        role: (selectedUser.role as 'user' | 'admin' | 'superadmin') || 'user',
        chips_balance: selectedUser.chips_balance || 0,
        brokecoin_balance: selectedUser.brokecoin_balance || 0
      })
    }
  }, [selectedUser, form])

  const { mutate: addUser, isPending: isAdding } = useMutation({
    mutationFn: (values: UserFormValues) => adminApi.createUser(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('User added successfully')
      setShowAddUserDialog(false)
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add user')
    }
  })

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: (values: UserFormValues) => 
      adminApi.updateUser(selectedUser?.id || '', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('User updated successfully')
      setShowEditUserDialog(false)
      setSelectedUser(null)
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update user')
    }
  })

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: () => adminApi.deleteUser(selectedUser?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('User deleted successfully')
      setShowDeleteUserDialog(false)
      setSelectedUser(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete user')
    }
  })

  return (
    <>
      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => addUser(data))} className='space-y-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='wallet_address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter wallet address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='user'>User</SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='superadmin'>Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowAddUserDialog(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add User'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateUser(data))} className='space-y-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='wallet_address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter wallet address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='user'>User</SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='superadmin'>Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setShowEditUserDialog(false)
                    setSelectedUser(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {selectedUser && ` "${selectedUser.username}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser()}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
