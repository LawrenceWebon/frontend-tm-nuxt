export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, checkAuth, isLoading } = useAuth()

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.includes(to.path)

  // If it's a public route, check if user is already authenticated
  if (isPublicRoute) {
    // Only check auth if user is not already authenticated
    if (!isAuthenticated.value) {
      await checkAuth()
    }
    
    // If user is authenticated and trying to access login/register, redirect to home
    if (isAuthenticated.value && ['/login', '/register'].includes(to.path)) {
      return navigateTo('/')
    }
    
    return
  }

  // For protected routes, check authentication
  if (!isAuthenticated.value) {
    // Perform auth check
    await checkAuth()
  }

  // If still not authenticated after check, redirect to login
  if (!isAuthenticated.value) {
    // Store the intended destination for redirect after login
    if (to.path !== '/') {
      if (process.client) {
        sessionStorage.setItem('auth.redirect', to.fullPath)
      }
    }
    return navigateTo('/login')
  }

  // Check for role-based access if needed
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && requiredRoles.length > 0) {
    const { user } = useAuth()
    const userRole = user.value?.role || 'user'
    
    if (!requiredRoles.includes(userRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Insufficient permissions.'
      })
    }
  }
})