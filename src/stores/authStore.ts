import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Admin {
  id: string
  username: string
  email: string
  role: string
}

interface AuthState {
  token: string | null
  admin: Admin | null
  isAuthenticated: boolean
  setAuth: (token: string, admin: Admin) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      setAuth: (token, admin) =>
        set({
          token,
          admin,
          isAuthenticated: true,
        }),
      reset: () =>
        set({
          token: null,
          admin: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'admin-auth',
    }
  )
)

// export const useAuth = () => useAuthStore((state) => state.auth)
