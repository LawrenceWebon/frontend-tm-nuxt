export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, checkAuth, user } = useAuth()

  // First ensure user is authenticated
  if (!isAuthenticated.value) {
    await checkAuth()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Get required roles from route meta
  const requiredRoles = to.meta.roles as string[] | undefined
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return
  }

  // Get user role
  const userRole = user.value?.role || 'user'
  
  // Check if user has required role
  if (!requiredRoles.includes(userRole)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. You do not have permission to access this page.'
    })
  }
})









