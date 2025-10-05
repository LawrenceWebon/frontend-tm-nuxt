<template>
  <component
    :is="tag"
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    :aria-pressed="ariaPressed"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
    :role="role"
    :tabindex="disabled ? -1 : 0"
    :class="buttonClasses"
    @click="handleClick"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <span v-if="loading" class="loading-spinner" aria-hidden="true">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>

    <span v-if="icon && !loading" class="icon" aria-hidden="true">
      <slot name="icon">
        <component :is="icon" />
      </slot>
    </span>

    <span v-if="$slots.default" class="content">
      <slot />
    </span>

    <span v-if="loading" class="sr-only">Loading...</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  tag?: 'button' | 'a' | 'div'
  href?: string
  target?: string
  rel?: string
  ariaLabel?: string
  ariaDescribedby?: string
  ariaPressed?: boolean | 'true' | 'false'
  ariaExpanded?: boolean | 'true' | 'false'
  ariaHaspopup?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  role?: string
  icon?: any
  fullWidth?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  tag: 'button',
  fullWidth: false,
  rounded: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  keydown: [event: KeyboardEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['text-sm', 'px-3', 'py-1.5', 'gap-1.5'],
    md: ['text-sm', 'px-4', 'py-2', 'gap-2'],
    lg: ['text-base', 'px-6', 'py-3', 'gap-2.5']
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700',
      'focus:ring-gray-200',
      'border',
      'border-transparent'
    ],
    secondary: [
      'bg-gray-200',
      'text-gray-900',
      'hover:bg-gray-300',
      'focus:ring-gray-500',
      'border',
      'border-gray-300'
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'hover:bg-red-700',
      'focus:ring-red-500',
      'border',
      'border-transparent'
    ],
    ghost: [
      'bg-transparent',
      'text-gray-700',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
      'border',
      'border-transparent'
    ],
    link: [
      'bg-transparent',
      'text-blue-600',
      'hover:text-blue-700',
      'hover:underline',
      'focus:ring-gray-200',
      'p-0'
    ]
  }

  // Additional classes
  const additionalClasses = []

  if (props.fullWidth) {
    additionalClasses.push('w-full')
  }

  if (props.rounded) {
    additionalClasses.push('rounded-full')
  } else {
    additionalClasses.push('rounded-md')
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...additionalClasses
  ]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading) return

  // Handle Enter and Space for non-button elements
  if (props.tag !== 'button' && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    if (event.key === ' ') {
      event.preventDefault()
    }
    emit('click', event as any)
  }

  emit('keydown', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
}

.icon {
  display: inline-flex;
  align-items: center;
}

.content {
  display: inline-flex;
  align-items: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
