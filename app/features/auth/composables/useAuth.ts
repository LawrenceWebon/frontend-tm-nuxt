import { useAuthStore } from '../stores/auth'

export interface LoginResult {
  success: boolean
  user?: any
  error?: string
}

export interface AuthError {
  message: string
  code?: string
}

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  
  // Loading states
  const isLoading = ref(false)
  const isLoggingIn = ref(false)
  const isLoggingOut = ref(false)
  const isCheckingAuth = ref(false)

  const login = async (email: string, password: string): Promise<LoginResult> => {
    isLoggingIn.value = true
    isLoading.value = true
    
    try {
      const result = await authStore.login(email, password)
      
      if (result.success) {
        // Redirect to home page on successful login
        await router.push('/')
        return { success: true, user: result.user }
      } else {
        return { success: false, error: result.error || 'Login failed' }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      return { success: false, error: errorMessage }
    } finally {
      isLoggingIn.value = false
      isLoading.value = false
    }
  }

  const logout = async (): Promise<boolean> => {
    isLoggingOut.value = true
    isLoading.value = true
    
    try {
      await authStore.logout()
      await router.push('/login')
      return true
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect to login even if logout API fails
      await router.push('/login')
      return false
    } finally {
      isLoggingOut.value = false
      isLoading.value = false
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    isCheckingAuth.value = true
    isLoading.value = true
    
    try {
      return await authStore.checkAuth()
    } catch (error) {
      console.error('Auth check error:', error)
      return false
    } finally {
      isCheckingAuth.value = false
      isLoading.value = false
    }
  }

  const fetchUser = async () => {
    isLoading.value = true
    
    try {
      return await authStore.fetchUser()
    } catch (error) {
      console.error('Fetch user error:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name: string, email: string, password: string, passwordConfirmation: string): Promise<LoginResult> => {
    isLoading.value = true
    
    try {
      // Validate password confirmation
      if (password !== passwordConfirmation) {
        return { success: false, error: 'Passwords do not match' }
      }

      const config = useRuntimeConfig()
      const response = await fetch(`${config.public.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.message || 'Registration failed' }
      }

      const data = await response.json()
      
      // Auto-login after successful registration
      const loginResult = await login(email, password)
      return loginResult
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    isLoading.value = true
    
    try {
      const response = await fetch(`${config.public.apiUrl}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.message || 'Failed to send reset email' }
      }

      const data = await response.json()
      return { success: true, message: data.message || 'Password reset email sent' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (token: string, email: string, password: string, passwordConfirmation: string): Promise<LoginResult> => {
    isLoading.value = true
    
    try {
      // Validate password confirmation
      if (password !== passwordConfirmation) {
        return { success: false, error: 'Passwords do not match' }
      }

      const response = await fetch(`${config.public.apiUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          token, 
          email, 
          password, 
          password_confirmation: passwordConfirmation 
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.message || 'Password reset failed' }
      }

      const data = await response.json()
      
      // Auto-login after successful password reset
      const loginResult = await login(email, password)
      return loginResult
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (userData: { name?: string; email?: string }): Promise<LoginResult> => {
    isLoading.value = true
    
    try {
      const response = await fetch(`${config.public.apiUrl}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.message || 'Profile update failed' }
      }

      const data = await response.json()
      
      // Update user data in store
      authStore.user = data.user
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(data.user))
      }

      return { success: true, user: data.user }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    isLoading.value = true
    
    try {
      // Validate password confirmation
      if (newPassword !== newPasswordConfirmation) {
        return { success: false, error: 'New passwords do not match' }
      }

      const response = await fetch(`${config.public.apiUrl}/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ 
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: newPasswordConfirmation
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.message || 'Password change failed' }
      }

      const data = await response.json()
      return { success: true, message: data.message || 'Password changed successfully' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize auth immediately (no need for onMounted in composable)
  authStore.initializeAuth()

  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoggedIn: computed(() => authStore.isLoggedIn),
    currentUser: computed(() => authStore.currentUser),
    
    // Loading states
    isLoading: readonly(isLoading),
    isLoggingIn: readonly(isLoggingIn),
    isLoggingOut: readonly(isLoggingOut),
    isCheckingAuth: readonly(isCheckingAuth),
    
    // Core actions
    login,
    logout,
    checkAuth,
    fetchUser,
    
    // Extended actions
    register,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    changePassword
  }
}
