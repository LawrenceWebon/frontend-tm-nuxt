import { reactive } from 'vue'

interface Notification {
  id: number
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration: number
  title?: string
  persistent?: boolean
}

const notifications = reactive<Notification[]>([])
let nextId = 1

export function useNotification() {
  const add = (
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
    duration = 3000,
    options: { title?: string; persistent?: boolean } = {}
  ) => {
    const id = nextId++

    notifications.push({
      id,
      message,
      type,
      duration: options.persistent ? 0 : duration,
      title: options.title,
      persistent: options.persistent
    })

    return id
  }

  const remove = (id: number) => {
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.splice(0, notifications.length)
  }

  return {
    notifications,
    add,
    remove,
    clearAll,
    success: (message: string, duration = 3000, options = {}) =>
      add(message, 'success', duration, options),
    error: (message: string, duration = 5000, options = {}) =>
      add(message, 'error', duration, options),
    info: (message: string, duration = 3000, options = {}) =>
      add(message, 'info', duration, options),
    warning: (message: string, duration = 4000, options = {}) =>
      add(message, 'warning', duration, options)
  }
}
