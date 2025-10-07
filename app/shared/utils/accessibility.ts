/**
 * Accessibility testing and validation utilities
 */

/**
 * Check if an element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  const rect = element.getBoundingClientRect()

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true' &&
    rect.width > 0 &&
    rect.height > 0
  )
}

/**
 * Get the accessible name of an element
 */
export function getAccessibleName(element: HTMLElement): string {
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

/**
 * Check if an element has proper focus management
 */
export function hasProperFocus(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return (
    element.tabIndex >= 0 &&
    style.outline !== 'none' &&
    (element.getAttribute('tabindex') !== '-1' || element.tagName === 'BUTTON')
  )
}

/**
 * Validate ARIA attributes
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const errors: string[] = []

  // Check for required ARIA attributes based on role
  const role = element.getAttribute('role')

  if (role === 'button' && !element.getAttribute('aria-label') && !element.textContent?.trim()) {
    errors.push('Button without accessible name')
  }

  if (role === 'link' && !element.getAttribute('aria-label') && !element.textContent?.trim()) {
    errors.push('Link without accessible name')
  }

  if (role === 'img' && !element.getAttribute('alt') && !element.getAttribute('aria-label')) {
    errors.push('Image without alt text or aria-label')
  }

  if (
    role === 'textbox' &&
    !element.getAttribute('aria-label') &&
    !element.getAttribute('aria-labelledby')
  ) {
    const label = document.querySelector(`label[for="${element.id}"]`)
    if (!label) {
      errors.push('Text input without accessible name')
    }
  }

  // Check for invalid ARIA attributes
  const ariaExpanded = element.getAttribute('aria-expanded')
  if (ariaExpanded && !['true', 'false'].includes(ariaExpanded)) {
    errors.push('Invalid aria-expanded value')
  }

  const ariaPressed = element.getAttribute('aria-pressed')
  if (ariaPressed && !['true', 'false', 'mixed'].includes(ariaPressed)) {
    errors.push('Invalid aria-pressed value')
  }

  return errors
}

/**
 * Check color contrast ratio
 */
export function checkColorContrast(foreground: string, background: string): number {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // This is a simplified version - use a proper library for production
    const rgb = color.match(/\d+/g)
    if (!rgb) return 0

    const [r, g, b] = rgb.map(Number)
    const [rs, gs, bs] = [r, g, b].map(c => {
      const normalized = (c ?? 0) / 255
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0)
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if text meets WCAG contrast requirements
 */
export function meetsWCAGContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = checkColorContrast(foreground, background)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

/**
 * Find elements with accessibility issues
 */
export function findAccessibilityIssues(container: HTMLElement = document.body): {
  missingLabels: HTMLElement[]
  missingAltText: HTMLImageElement[]
  invalidAria: HTMLElement[]
  focusIssues: HTMLElement[]
} {
  const issues = {
    missingLabels: [] as HTMLElement[],
    missingAltText: [] as HTMLImageElement[],
    invalidAria: [] as HTMLElement[],
    focusIssues: [] as HTMLElement[]
  }

  const elements = container.querySelectorAll('*')

  elements.forEach(element => {
    const htmlElement = element as HTMLElement

    // Check for missing labels on form elements
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(htmlElement.tagName)) {
      const accessibleName = getAccessibleName(htmlElement)
      if (!accessibleName) {
        issues.missingLabels.push(htmlElement)
      }
    }

    // Check for missing alt text on images
    if (htmlElement.tagName === 'IMG') {
      const img = htmlElement as HTMLImageElement
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.missingAltText.push(img)
      }
    }

    // Check for invalid ARIA attributes
    const ariaErrors = validateAriaAttributes(htmlElement)
    if (ariaErrors.length > 0) {
      issues.invalidAria.push(htmlElement)
    }

    // Check for focus issues on interactive elements
    if (['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(htmlElement.tagName)) {
      if (!hasProperFocus(htmlElement)) {
        issues.focusIssues.push(htmlElement)
      }
    }
  })

  return issues
}

/**
 * Generate accessibility report
 */
export function generateAccessibilityReport(container: HTMLElement = document.body): string {
  const issues = findAccessibilityIssues(container)
  const report = []

  report.push('=== Accessibility Report ===\n')

  if (issues.missingLabels.length > 0) {
    report.push(`❌ Missing Labels: ${issues.missingLabels.length} elements`)
    issues.missingLabels.forEach((el, index) => {
      report.push(`  ${index + 1}. ${el.tagName}${el.id ? `#${el.id}` : ''}`)
    })
    report.push('')
  }

  if (issues.missingAltText.length > 0) {
    report.push(`❌ Missing Alt Text: ${issues.missingAltText.length} images`)
    issues.missingAltText.forEach((img, index) => {
      report.push(`  ${index + 1}. ${img.src}`)
    })
    report.push('')
  }

  if (issues.invalidAria.length > 0) {
    report.push(`❌ Invalid ARIA: ${issues.invalidAria.length} elements`)
    issues.invalidAria.forEach((el, index) => {
      const ariaErrors = validateAriaAttributes(el)
      report.push(
        `  ${index + 1}. ${el.tagName}${el.id ? `#${el.id}` : ''}: ${ariaErrors.join(', ')}`
      )
    })
    report.push('')
  }

  if (issues.focusIssues.length > 0) {
    report.push(`❌ Focus Issues: ${issues.focusIssues.length} elements`)
    issues.focusIssues.forEach((el, index) => {
      report.push(`  ${index + 1}. ${el.tagName}${el.id ? `#${el.id}` : ''}`)
    })
    report.push('')
  }

  if (Object.values(issues).every(arr => arr.length === 0)) {
    report.push('✅ No accessibility issues found!')
  }

  return report.join('\n')
}

/**
 * Test keyboard navigation
 */
export function testKeyboardNavigation(container: HTMLElement = document.body): boolean {
  const focusableElements = container.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )

  let allFocusable = true

  focusableElements.forEach(element => {
    const htmlElement = element as HTMLElement
    if (
      htmlElement.tabIndex < 0 &&
      !['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(htmlElement.tagName)
    ) {
      allFocusable = false
    }
  })

  return allFocusable
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}
