import { useAuthStore } from '../../features/auth/stores/auth'

export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
  skipAuth?: boolean
}

export function useApi() {
  const authStore = useAuthStore()
  
  // Request queue for handling concurrent requests during token refresh
  const requestQueue: Array<() => Promise<any>> = []
  let isRefreshing = false

  // Base API URL
  const baseURL = 'http://localhost/api'

  // Default request options
  const defaultOptions: RequestOptions = {
    timeout: 10000,
    retries: 3,
    credentials: 'include'
  }

  // Create AbortController for request cancellation
  const createAbortController = (timeout: number) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    return { controller, timeoutId }
  }

  // Get CSRF token
  const getCsrfToken = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${baseURL}/csrf-cookie`, {
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
  }

  // Handle token refresh
  const refreshToken = async (): Promise<boolean> => {
    if (isRefreshing) {
      // Wait for ongoing refresh
      return new Promise((resolve) => {
        const checkRefresh = () => {
          if (!isRefreshing) {
            resolve(authStore.isAuthenticated)
          } else {
            setTimeout(checkRefresh, 100)
          }
        }
        checkRefresh()
      })
    }

    isRefreshing = true

    try {
      const csrfToken = await getCsrfToken()
      
      const response = await fetch(`${baseURL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {})
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        authStore.token = data.token
        authStore.isAuthenticated = true
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', data.token)
        }
        
        return true
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear local state without calling logout API
      authStore.user = null
      authStore.token = null
      authStore.isAuthenticated = false
      return false
    } finally {
      isRefreshing = false
      
      // Process queued requests
      const queue = [...requestQueue]
      requestQueue.length = 0
      queue.forEach(request => request())
    }
  }

  // Enhanced fetch with authentication
  const fetchWithAuth = async <T = any>(
    url: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    const { timeout = 10000, retries = 3, skipAuth = false, ...fetchOptions } = {
      ...defaultOptions,
      ...options
    }

    const { controller, timeoutId } = createAbortController(timeout)

    const makeRequest = async (attempt: number = 1): Promise<ApiResponse<T>> => {
      try {
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'Origin': window.location.origin,
          ...(fetchOptions.headers as Record<string, string> || {})
        }

        // Add content type for non-GET requests with body
        if (fetchOptions.method && fetchOptions.method !== 'GET' && fetchOptions.body) {
          if (!(fetchOptions.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json'
          }
        }

        // Skip CSRF token for API routes - use Bearer token authentication instead
        // CSRF tokens are only needed for session-based authentication, not API token authentication

        // Add authorization header if not skipped
        if (!skipAuth && authStore.token) {
          headers['Authorization'] = `Bearer ${authStore.token}`
        }

        const response = await fetch(`${baseURL}${url}`, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
          credentials: 'include'
        })

        clearTimeout(timeoutId)

        // Handle 401 Unauthorized
        if (response.status === 401 && !skipAuth) {
          if (attempt === 1) {
            // Try to refresh token
            const refreshSuccess = await refreshToken()
            if (refreshSuccess) {
              // Retry the request with new token
              return makeRequest(attempt + 1)
            }
          }
          
          // Refresh failed or max retries reached
          // Clear local state without calling logout API
          authStore.user = null
          authStore.token = null
          authStore.isAuthenticated = false
          navigateTo('/login')
          throw new Error('Unauthorized')
        }

        // Handle other error status codes
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const error: ApiError = {
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            errors: errorData.errors
          }
          
          // Don't retry on client errors (4xx) for DELETE operations
          if (response.status >= 400 && response.status < 500 && fetchOptions.method === 'DELETE') {
            throw error
          }
          
          throw error
        }

        // Parse response
        const data = await response.json()
        
        return {
          data: data.data || data,
          message: data.message,
          status: response.status,
          success: true
        }

      } catch (error) {
        clearTimeout(timeoutId)

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('Request timeout')
          }
          
          if (attempt < retries && !error.message.includes('Unauthorized') && !error.message.includes('Forbidden')) {
            // Retry on network errors, but not on client errors (4xx)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
            return makeRequest(attempt + 1)
          }
        }

        throw error
      }
    }

    // If token is being refreshed, queue the request
    if (isRefreshing && !skipAuth) {
      return new Promise((resolve, reject) => {
        requestQueue.push(async () => {
          try {
            const result = await makeRequest()
            resolve(result)
          } catch (error) {
            reject(error)
          }
        })
      })
    }

    return makeRequest()
  }

  // Convenience methods
  const get = <T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => 
    fetchWithAuth<T>(url, { ...options, method: 'GET' })

  const post = <T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> => 
    fetchWithAuth<T>(url, { 
      ...options, 
      method: 'POST', 
      body: data instanceof FormData ? data : JSON.stringify(data)
    })

  const put = <T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> => 
    fetchWithAuth<T>(url, { 
      ...options, 
      method: 'PUT', 
      body: data instanceof FormData ? data : JSON.stringify(data)
    })

  const patch = <T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> => 
    fetchWithAuth<T>(url, { 
      ...options, 
      method: 'PATCH', 
      body: data instanceof FormData ? data : JSON.stringify(data)
    })

  const del = <T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => 
    fetchWithAuth<T>(url, { ...options, method: 'DELETE' })

  // File upload helper
  const uploadFile = async <T = any>(
    url: string, 
    file: File, 
    additionalData: Record<string, any> = {},
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    const formData = new FormData()
    formData.append('file', file)
    
    // Add additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    return post<T>(url, formData, {
      ...options,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(options.headers || {})
      }
    })
  }

  // Batch requests helper
  const batch = async <T = any>(
    requests: Array<() => Promise<ApiResponse<T>>>
  ): Promise<ApiResponse<T>[]> => {
    return Promise.all(requests.map(request => request()))
  }

  // Request cancellation
  const createCancellableRequest = <T = any>(
    url: string, 
    options: RequestOptions = {}
  ) => {
    const { controller } = createAbortController(options.timeout || 10000)
    
    const request = fetchWithAuth<T>(url, {
      ...options,
      signal: controller.signal
    })

    return {
      request,
      cancel: () => controller.abort()
    }
  }

  // Logout method
  const logout = async (): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${baseURL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': '0',
          'Origin': window.location.origin
        },
        body: '', // Empty body as expected by the API
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        return {
          data: data,
          message: data.message || 'Logged out successfully',
          status: response.status,
          success: true
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return {
    // Core methods
    fetchWithAuth,
    get,
    post,
    put,
    patch,
    del,
    logout,
    
    // Advanced methods
    uploadFile,
    batch,
    createCancellableRequest,
    
    // Utilities
    refreshToken
  }
}