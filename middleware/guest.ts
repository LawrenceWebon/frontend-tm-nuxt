export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, checkAuth } = useAuth()

  // Check if user is authenticated
  await checkAuth()

  // If user is authenticated, redirect to home page
  if (isAuthenticated.value) {
    // Check if there's a stored redirect path
    if (process.client) {
      const redirectPath = sessionStorage.getItem('auth.redirect')
      if (redirectPath) {
        sessionStorage.removeItem('auth.redirect')
        return navigateTo(redirectPath)
      }
    }
    
    return navigateTo('/')
  }
})







