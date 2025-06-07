import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
   
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().reset()
    }
    return Promise.reject(error)
  }
)

export const adminApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/admin/auth/login', { username, password })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/admin/auth/profile')
    return response.data
  },

  updateProfile: async (profileData: {
    username: string
    email: string
    bio?: string
  }) => {
    const response = await api.patch('/admin/auth/profile', profileData)
    return response.data
  },

  createAdmin: async (adminData: {
    username: string
    email: string
    password: string
    role?: string
  }) => {
    const response = await api.post('/admin/auth/register', adminData)
    return response.data
  },

  setupSuperAdmin: async (adminData: {
    username: string
    email: string
    password: string
  }) => {
    const response = await api.post('/admin/auth/setup', adminData)
    return response.data
  },

  // Dashboard Data
  getSystemStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },

  // User Management
  getUsers: async (filters: any, page: number, limit: number) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.role && { role: filters.role })
    })
        console.log(queryParams);
    const response = await api.get('/admin/users', {
      params: { ...filters, page, limit }
    })
    return response.data
  },

  createUser: async (userData: {
    username: string
    wallet_address: string
    role: string
    chips_balance: number
    brokecoin_balance: number
  }) => {
    const response = await api.post('/admin/users', userData)
    return response.data
  },

  updateUser: async (userId: string, userData: {
    username?: string
    wallet_address?: string
    role?: string
    chips_balance?: number
    brokecoin_balance?: number
  }) => {
    const response = await api.put(`/admin/users/${userId}`, userData)
    return response.data
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`)
    return response.data
  },

  updateUserBalance: async (
    userId: string,
    brokecoinDelta: number,
    chipsDelta: number
  ) => {
    const response = await api.post(`/admin/users/${userId}/balance`, {
      brokecoinDelta,
      chipsDelta
    })
    return response.data
  },

  // Transaction Management
  getTransactions: async (filters: any, page: number, limit: number) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.status && { status: filters.status }),
      ...(filters.type && { type: filters.type }),
      ...(filters.wallet_address && { wallet_address: filters.wallet_address }),
      ...(filters.start_date && { start_date: filters.start_date }),
      ...(filters.end_date && { end_date: filters.end_date })
    })
        console.log(queryParams);
    const response = await api.get('/admin/transactions', {
      params: { ...filters, page, limit }
    })
    return response.data
  },

  updateTransactionStatus: async (transactionId: string, status: string) => {
    const response = await api.patch(`/admin/transactions/${transactionId}/status`, {
      status
    })
    return response.data
  },

  // Task Management
  getTasks: async (filters = {}, page = 1, limit = 10) => {
    const response = await api.get('/admin/tasks', {
      params: { ...filters, page, limit }
    })
    return response.data
  },

  getTaskDetails: async (taskId: string) => {
    const response = await api.get(`/admin/tasks/${taskId}`)
    return response.data
  },

  createTask: async (taskData: any) => {
    const response = await api.post('/admin/tasks', taskData)
    return response.data
  },

  updateTask: async (taskId: string, taskData: any) => {
    const response = await api.put(`/admin/tasks/${taskId}`, taskData)
    return response.data
  },

  updateTaskStatus: async (taskId: string, status: string) => {
    const response = await api.patch(`/admin/tasks/${taskId}/status`, {
      status
    })
    return response.data
  },

  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/admin/tasks/${taskId}`)
    return response.data
  },

  addTaskComment: async (taskId: string, comment: string) => {
    const response = await api.post(`/admin/tasks/${taskId}/comments`, {
      comment
    })
    return response.data
  },

  addTaskAttachment: async (taskId: string, fileData: any) => {
    const response = await api.post(`/admin/tasks/${taskId}/attachments`, fileData)
    return response.data
  },

  getAdmins: async (filters: any, page: number, limit: number) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.role && { role: filters.role })
    })
    console.log(queryParams);
    const response = await api.get('/admin/admins', {
      params: { ...filters, page, limit }
    })
    return response.data
  }
}

export default api 