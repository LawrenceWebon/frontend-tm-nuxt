import { useAuth } from './useAuth'
import { useRouter } from 'vue-router'

export function useAutoLogout() {
  const { logout, isAuthenticated } = useAuth()
  const router = useRouter()
  
  // 10 minutes in milliseconds
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000
  
  let inactivityTimer: NodeJS.Timeout | null = null
  let warningTimer: NodeJS.Timeout | null = null
  let lastActivity = Date.now()
  
  // Events that indicate user activity
  const activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
    'keydown'
  ]
  
  // Warning time (1 minute before logout)
  const WARNING_TIME = 1 * 60 * 1000
  
  const resetTimer = () => {
    lastActivity = Date.now()
    
    // Clear existing timers
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }
    if (warningTimer) {
      clearTimeout(warningTimer)
    }
    
    // Only set timers if user is authenticated
    if (isAuthenticated.value) {
      // Set warning timer (9 minutes)
      warningTimer = setTimeout(() => {
        showWarning()
      }, INACTIVITY_TIMEOUT - WARNING_TIME)
      
      // Set logout timer (10 minutes)
      inactivityTimer = setTimeout(() => {
        handleAutoLogout()
      }, INACTIVITY_TIMEOUT)
    }
  }
  
  const showWarning = () => {
    // Show a warning dialog or notification
    const warningMessage = 'You will be automatically logged out in 1 minute due to inactivity. Click anywhere to stay logged in.'
    
    // Create a modal or use a notification system
    if (confirm(warningMessage)) {
      // User clicked OK, reset the timer
      resetTimer()
    }
    // If user doesn't respond, logout will happen automatically
  }
  
  const handleAutoLogout = async () => {
    
    // Show logout notification
    alert('You have been automatically logged out due to inactivity.')
    
    // Perform logout
    await logout()
    
    // Redirect to login page
    await router.push('/login')
  }
  
  const handleActivity = () => {
    // Only reset timer if user is authenticated
    if (isAuthenticated.value) {
      resetTimer()
    }
  }
  
  const startAutoLogout = () => {
    if (typeof window === 'undefined') return
    
    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })
    
    // Start the initial timer
    resetTimer()
  }
  
  const stopAutoLogout = () => {
    if (typeof window === 'undefined') return
    
    // Remove event listeners
    activityEvents.forEach(event => {
      document.removeEventListener(event, handleActivity, true)
    })
    
    // Clear timers
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = null
    }
    if (warningTimer) {
      clearTimeout(warningTimer)
      warningTimer = null
    }
  }
  
  const getTimeUntilLogout = () => {
    if (!isAuthenticated.value) return 0
    
    const timeSinceActivity = Date.now() - lastActivity
    const timeUntilLogout = INACTIVITY_TIMEOUT - timeSinceActivity
    
    return Math.max(0, timeUntilLogout)
  }
  
  const getMinutesUntilLogout = () => {
    const milliseconds = getTimeUntilLogout()
    return Math.ceil(milliseconds / (1000 * 60))
  }
  
  return {
    startAutoLogout,
    stopAutoLogout,
    resetTimer,
    getTimeUntilLogout,
    getMinutesUntilLogout,
    INACTIVITY_TIMEOUT,
    WARNING_TIME
  }
}
