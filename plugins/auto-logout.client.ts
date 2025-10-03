export default defineNuxtPlugin(() => {
  const { startAutoLogout, stopAutoLogout } = useAutoLogout()
  const { isAuthenticated, checkInactivity, logout } = useAuth()
  const router = useRouter()

  // Start auto-logout when authenticated
  watch(isAuthenticated, (authenticated) => {
    if (authenticated) {
      startAutoLogout()
    } else {
      stopAutoLogout()
    }
  }, { immediate: true })

  // Check for inactivity every minute
  setInterval(() => {
    if (isAuthenticated.value && checkInactivity()) {
      logout()
      router.push('/login')
    }
  }, 60000) // Check every minute

  // Also check on page visibility change
  if (typeof window !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isAuthenticated.value) {
        // Page is hidden, check if user should be logged out
        if (checkInactivity()) {
          logout()
          router.push('/login')
        }
      }
    })
  }
})
