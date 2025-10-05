import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * Accessibility composable for managing focus, keyboard navigation, and ARIA attributes
 */
export function useAccessibility() {
  const focusableElements = ref<HTMLElement[]>([])
  const currentFocusIndex = ref(-1)
  const trapContainer = ref<HTMLElement | null>(null)

  /**
   * Get all focusable elements within a container
   */
  const getFocusableElements = (container?: HTMLElement): HTMLElement[] => {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    const elements = container 
      ? Array.from(container.querySelectorAll(selector)) as HTMLElement[]
      : Array.from(document.querySelectorAll(selector)) as HTMLElement[]

    return elements.filter(el => {
      const style = window.getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })
  }

  /**
   * Set up focus trap for modal or dropdown
   */
  const setupFocusTrap = (container: HTMLElement) => {
    trapContainer.value = container
    focusableElements.value = getFocusableElements(container)
    currentFocusIndex.value = 0

    if (focusableElements.value.length > 0) {
      focusableElements.value[0].focus()
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        
        if (event.shiftKey) {
          // Shift + Tab - move backwards
          currentFocusIndex.value = currentFocusIndex.value > 0 
            ? currentFocusIndex.value - 1 
            : focusableElements.value.length - 1
        } else {
          // Tab - move forwards
          currentFocusIndex.value = currentFocusIndex.value < focusableElements.value.length - 1 
            ? currentFocusIndex.value + 1 
            : 0
        }

        focusableElements.value[currentFocusIndex.value]?.focus()
      } else if (event.key === 'Escape') {
        // Close modal/dropdown on Escape
        const closeEvent = new CustomEvent('close-accessibility-trap')
        container.dispatchEvent(closeEvent)
      }
    }

    container.addEventListener('keydown', handleKeydown)
    
    return () => {
      container.removeEventListener('keydown', handleKeydown)
    }
  }

  /**
   * Announce message to screen readers
   */
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  /**
   * Move focus to next focusable element
   */
  const focusNext = (container?: HTMLElement) => {
    const elements = getFocusableElements(container)
    const currentIndex = elements.findIndex(el => el === document.activeElement)
    
    if (currentIndex >= 0 && currentIndex < elements.length - 1) {
      elements[currentIndex + 1].focus()
    } else if (elements.length > 0) {
      elements[0].focus()
    }
  }

  /**
   * Move focus to previous focusable element
   */
  const focusPrevious = (container?: HTMLElement) => {
    const elements = getFocusableElements(container)
    const currentIndex = elements.findIndex(el => el === document.activeElement)
    
    if (currentIndex > 0) {
      elements[currentIndex - 1].focus()
    } else if (elements.length > 0) {
      elements[elements.length - 1].focus()
    }
  }

  /**
   * Focus first focusable element in container
   */
  const focusFirst = (container?: HTMLElement) => {
    const elements = getFocusableElements(container)
    if (elements.length > 0) {
      elements[0].focus()
    }
  }

  /**
   * Focus last focusable element in container
   */
  const focusLast = (container?: HTMLElement) => {
    const elements = getFocusableElements(container)
    if (elements.length > 0) {
      elements[elements.length - 1].focus()
    }
  }

  /**
   * Handle arrow key navigation for lists
   */
  const handleArrowNavigation = (
    event: KeyboardEvent,
    items: HTMLElement[],
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ) => {
    const currentIndex = items.findIndex(item => item === document.activeElement)
    
    if (currentIndex === -1) return

    let targetIndex = currentIndex

    switch (event.key) {
      case orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight':
        event.preventDefault()
        targetIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        break
      case orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft':
        event.preventDefault()
        targetIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        break
      case 'Home':
        event.preventDefault()
        targetIndex = 0
        break
      case 'End':
        event.preventDefault()
        targetIndex = items.length - 1
        break
      default:
        return
    }

    items[targetIndex]?.focus()
  }

  /**
   * Generate unique ID for ARIA attributes
   */
  const generateId = (prefix: string = 'accessibility'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Check if element is visible to screen readers
   */
  const isVisibleToScreenReader = (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element)
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           element.getAttribute('aria-hidden') !== 'true'
  }

  /**
   * Get accessible name for element
   */
  const getAccessibleName = (element: HTMLElement): string => {
    // Check aria-label first
    const ariaLabel = element.getAttribute('aria-label')
    if (ariaLabel) return ariaLabel

    // Check aria-labelledby
    const ariaLabelledBy = element.getAttribute('aria-labelledby')
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy)
      if (labelElement) return labelElement.textContent || ''
    }

    // Check associated label
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`)
      if (label) return label.textContent || ''
    }

    // Check title attribute
    const title = element.getAttribute('title')
    if (title) return title

    // Check alt text for images
    if (element.tagName === 'IMG') {
      return element.getAttribute('alt') || ''
    }

    // Fall back to text content
    return element.textContent?.trim() || ''
  }

  return {
    // Focus management
    setupFocusTrap,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    
    // Navigation
    handleArrowNavigation,
    getFocusableElements,
    
    // Screen reader support
    announceToScreenReader,
    getAccessibleName,
    isVisibleToScreenReader,
    
    // Utilities
    generateId,
    
    // Refs
    focusableElements,
    currentFocusIndex,
    trapContainer
  }
}

/**
 * Composable for managing ARIA live regions
 */
export function useAriaLive() {
  const createLiveRegion = (priority: 'polite' | 'assertive' = 'polite') => {
    const region = document.createElement('div')
    region.setAttribute('aria-live', priority)
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    document.body.appendChild(region)

    const announce = (message: string) => {
      region.textContent = message
    }

    const destroy = () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region)
      }
    }

    return { announce, destroy }
  }

  return { createLiveRegion }
}

/**
 * Composable for keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const shortcuts = ref<Map<string, () => void>>(new Map())

  const addShortcut = (key: string, callback: () => void, modifiers: string[] = []) => {
    const shortcutKey = `${modifiers.join('+')}+${key}`.toLowerCase()
    shortcuts.value.set(shortcutKey, callback)
  }

  const removeShortcut = (key: string, modifiers: string[] = []) => {
    const shortcutKey = `${modifiers.join('+')}+${key}`.toLowerCase()
    shortcuts.value.delete(shortcutKey)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const modifiers = []
    if (event.ctrlKey) modifiers.push('ctrl')
    if (event.altKey) modifiers.push('alt')
    if (event.shiftKey) modifiers.push('shift')
    if (event.metaKey) modifiers.push('meta')

    const shortcutKey = `${modifiers.join('+')}+${event.key}`.toLowerCase()
    const callback = shortcuts.value.get(shortcutKey)

    if (callback) {
      event.preventDefault()
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    addShortcut,
    removeShortcut,
    shortcuts
  }
}
