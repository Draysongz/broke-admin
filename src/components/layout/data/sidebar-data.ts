import {
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconMessages,
  IconNotification,
  IconPalette,
  IconSettings,
  IconUserCog,
  IconTransactionDollar,
  IconUsers,
} from '@tabler/icons-react'
import { Command} from 'lucide-react'

import { type SidebarData } from '../types'
import { useAuthStore } from '@/stores/authStore'

export const sidebarData: SidebarData = {
  user: {
    name: useAuthStore.getState().admin?.username || 'Admin',
    email: useAuthStore.getState().admin?.email || 'admin@example.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'BrokeCoin Admin',
      logo: Command,
      plan: 'Admin',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        }, 
        {
          title: 'Transactions',
          url: '/transactions',
          icon: IconTransactionDollar,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },

          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
