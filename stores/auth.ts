import { defineStore } from 'pinia'
import { useApi } from '../app/composables/useApi'

export interface User {
  id: number
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async getCsrfToken() {
      try {
        const response = await fetch('http://localhost/api/csrf-cookie', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          return data.csrf_token
        }
        return null
      } catch (error) {
        console.error('Failed to get CSRF token:', error)
        return null
      }
    },

    async login(email: string, password: string) {
      try {
        // Get CSRF token first
        const csrfToken = await this.getCsrfToken()
        
        const response = await fetch('http://localhost/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin,
            ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Invalid credentials')
        }

        const data = await response.json()
        
        this.user = data.user
        this.token = data.token
        this.isAuthenticated = true

        // Store token in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('auth_user', JSON.stringify(data.user))
        }

        return { success: true, user: data.user }
      } catch (error) {
        console.error('Login failed:', error)
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Login failed' 
        }
      }
    },

    async logout() {
      try {
        if (this.token) {
          const { logout: apiLogout } = useApi()
          await apiLogout()
        }
      } catch (error) {
        console.error('Logout API call failed:', error)
      } finally {
        // Clear state regardless of API call success
        this.user = null
        this.token = null
        this.isAuthenticated = false

        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        }
      }
    },

    async checkAuth() {
      if (typeof window === 'undefined') {
        return false
      }

      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('auth_user')

      if (!token || !userData) {
        return false
      }

      try {
        this.token = token
        this.user = JSON.parse(userData)
        this.isAuthenticated = true

        // Verify token is still valid by fetching user data
        const response = await fetch('http://localhost/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Token invalid')
        }

        const apiUserData = await response.json()
        this.user = apiUserData

        return true
      } catch (error) {
        console.error('Auth check failed:', error)
        // Clear local state without calling logout API
        this.user = null
        this.token = null
        this.isAuthenticated = false
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        }
        
        return false
      }
    },

    async fetchUser() {
      if (!this.token) {
        return null
      }

      try {
        const response = await fetch('http://localhost/api/user', {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const userData = await response.json()
        this.user = userData

        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(userData))
        }

        return userData
      } catch (error) {
        console.error('Fetch user failed:', error)
        // Clear local state without calling logout API
        this.user = null
        this.token = null
        this.isAuthenticated = false
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        }
        
        return null
      }
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      if (typeof window === 'undefined') {
        return
      }

      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('auth_user')

      if (token && userData) {
        this.token = token
        this.user = JSON.parse(userData)
        this.isAuthenticated = true
        
        // Check if token is expired
        this.checkTokenExpiration()
      }
    },

    // Check if token is expired and handle accordingly
    checkTokenExpiration() {
      if (!this.token || !this.isAuthenticated) {
        return
      }

      try {
        // Decode JWT token to check expiration
        const tokenParts = this.token.split('.')
        if (tokenParts.length === 3 && tokenParts[1]) {
          const payload = JSON.parse(atob(tokenParts[1]))
          const currentTime = Math.floor(Date.now() / 1000)
          
          // If token is expired or expires within 5 minutes, refresh it
          if (payload.exp && (payload.exp <= currentTime || payload.exp <= currentTime + 300)) {
            console.log('Token expired or expiring soon, refreshing...')
            this.refreshTokenIfNeeded()
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error)
        // If we can't decode the token, assume it's invalid
        this.logout()
      }
    },

    // Refresh token if needed
    async refreshTokenIfNeeded() {
      try {
        const { refreshToken } = useApi()
        const success = await refreshToken()
        
        if (!success) {
          // Refresh failed, logout user
          this.logout()
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.logout()
      }
    }
  }
})
