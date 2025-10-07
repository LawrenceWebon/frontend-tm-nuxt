import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Composable for handling click outside detection
 * @param target - The ref element to watch for clicks outside
 * @param callback - Function to call when clicking outside
 */
export function onClickOutside(target: Ref<boolean>, callback: () => void) {
  const listener = (event: MouseEvent) => {
    if (target.value && !(event.target as Element).closest('.relative')) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('click', listener)
  })

  onUnmounted(() => {
    document.removeEventListener('click', listener)
  })
}

/**
 * Composable for click outside detection with more control
 * @param target - The ref element to watch for clicks outside
 * @param callback - Function to call when clicking outside
 * @param excludeSelectors - Array of CSS selectors to exclude from outside detection
 */
export function useClickOutside(
  target: Ref<boolean>,
  callback: () => void,
  excludeSelectors: string[] = []
) {
  const listener = (event: MouseEvent) => {
    if (!target.value) return

    const targetElement = event.target as Element

    // Check if click is inside the target element or its children
    const isInsideTarget = targetElement.closest('.relative')
    if (isInsideTarget) return

    // Check if click is inside any excluded selectors
    const isInsideExcluded = excludeSelectors.some(selector => targetElement.closest(selector))
    if (isInsideExcluded) return

    callback()
  }

  onMounted(() => {
    document.addEventListener('click', listener)
  })

  onUnmounted(() => {
    document.removeEventListener('click', listener)
  })
}
