import { reactive } from 'vue'

interface Notification {
  id: number
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration: number
}

const notifications = reactive<Notification[]>([])
let nextId = 1

export function useNotification() {
  const add = (
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
    duration = 3000
  ) => {
    const id = nextId++

    notifications.push({
      id,
      message,
      type,
      duration
    })

    return id
  }

  const remove = (id: number) => {
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.splice(index, 1)
    }
  }

  return {
    notifications,
    add,
    remove,
    success: (message: string, duration = 3000) => add(message, 'success', duration),
    error: (message: string, duration = 3000) => add(message, 'error', duration),
    info: (message: string, duration = 3000) => add(message, 'info', duration),
    warning: (message: string, duration = 3000) => add(message, 'warning', duration)
  }
}
