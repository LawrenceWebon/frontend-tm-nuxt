import { useAutoLogout } from '../composables/useAutoLogout'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

export default defineNuxtPlugin(() => {
  const { startAutoLogout, stopAutoLogout } = useAutoLogout()
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  // Start auto-logout when authenticated
  watch(isAuthenticated, (authenticated) => {
    if (authenticated) {
      startAutoLogout()
    } else {
      stopAutoLogout()
    }
  }, { immediate: true })
})
