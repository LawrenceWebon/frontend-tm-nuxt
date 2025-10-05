<template>
  <div>
    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
      <svg
        class="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start"
    >
      <svg
        class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      <p class="text-green-700 text-sm">{{ successMessage }}</p>
    </div>

    <!-- Invalid Token Message -->
    <div
      v-if="invalidToken"
      class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
    >
      <svg
        class="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
      <div>
        <p class="text-red-700 text-sm font-medium">Invalid or expired reset link</p>
        <p class="text-red-600 text-sm mt-1">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <NuxtLink
          to="/forgot-password"
          class="inline-block mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Request new reset link
        </NuxtLink>
      </div>
    </div>

    <!-- Reset Password Form -->
    <form v-if="!invalidToken" @submit.prevent="handleResetPassword" class="space-y-6" novalidate>
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
        <p class="text-gray-600 text-sm">Enter your new password below.</p>
      </div>

      <!-- Email Field (hidden, populated from URL) -->
      <div v-if="form.email">
        <label class="block text-sm text-gray-600 mb-2">Email</label>
        <input
          type="email"
          :value="form.email"
          disabled
          class="w-full px-3 py-1.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 text-sm"
        />
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm text-black mb-2">New Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          autocomplete="new-password"
          :class="[
            'w-full px-3 py-1.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors text-sm',
            passwordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          ]"
          placeholder="Enter your new password"
          :disabled="isLoading"
          @blur="validatePassword"
          @input="clearFieldError('password')"
          aria-describedby="password-error"
        />
        <p v-if="passwordError" id="password-error" class="mt-2 text-sm text-red-600">
          {{ passwordError }}
        </p>
      </div>

      <!-- Confirm Password Field -->
      <div>
        <label for="password_confirmation" class="block text-sm text-black mb-2">
          Confirm New Password
        </label>
        <input
          id="password_confirmation"
          v-model="form.passwordConfirmation"
          type="password"
          required
          autocomplete="new-password"
          :class="[
            'w-full px-3 py-1.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors text-sm',
            passwordConfirmationError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          ]"
          placeholder="Confirm your new password"
          :disabled="isLoading"
          @blur="validatePasswordConfirmation"
          @input="clearFieldError('passwordConfirmation')"
          aria-describedby="password-confirmation-error"
        />
        <p
          v-if="passwordConfirmationError"
          id="password-confirmation-error"
          class="mt-2 text-sm text-red-600"
        >
          {{ passwordConfirmationError }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || !isFormValid"
        class="w-full bg-black text-white py-2 px-1 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
      >
        <svg
          v-if="isLoading"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ isLoading ? 'Resetting...' : 'Reset Password' }}
      </button>
    </form>

    <!-- Back to Login Link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Remember your password?
        <NuxtLink
          to="/login"
          class="font-medium text-black hover:text-gray-800 transition-colors focus:outline-none focus:underline"
        >
          Sign in here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuth } from '../features/auth/composables/useAuth'
import { useRoute, useRouter } from 'vue-router'

// Redirect if already authenticated
definePageMeta({
  layout: 'auth',
  middleware: []
})

const { resetPassword, isAuthenticated, isLoading: authLoading } = useAuth()
const router = useRouter()
const route = useRoute()

// Form state
const form = ref({
  email: '',
  token: '',
  password: '',
  passwordConfirmation: ''
})

// UI state
const error = ref('')
const successMessage = ref('')
const invalidToken = ref(false)
const passwordError = ref('')
const passwordConfirmationError = ref('')

// Computed properties
const isLoading = computed(() => authLoading.value)
const isFormValid = computed(() => {
  return (
    form.value.email &&
    form.value.token &&
    form.value.password &&
    form.value.passwordConfirmation &&
    !passwordError.value &&
    !passwordConfirmationError.value &&
    isValidPassword(form.value.password) &&
    form.value.password === form.value.passwordConfirmation
  )
})

// Validation functions
const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

const validatePassword = () => {
  if (!form.value.password) {
    passwordError.value = 'Password is required'
    return false
  }
  if (!isValidPassword(form.value.password)) {
    passwordError.value = 'Password must be at least 6 characters long'
    return false
  }
  passwordError.value = ''
  return true
}

const validatePasswordConfirmation = () => {
  if (!form.value.passwordConfirmation) {
    passwordConfirmationError.value = 'Password confirmation is required'
    return false
  }
  if (form.value.password !== form.value.passwordConfirmation) {
    passwordConfirmationError.value = 'Passwords do not match'
    return false
  }
  passwordConfirmationError.value = ''
  return true
}

const clearFieldError = (field: string) => {
  if (field === 'password') {
    passwordError.value = ''
  } else if (field === 'passwordConfirmation') {
    passwordConfirmationError.value = ''
  }
}

const clearMessages = () => {
  error.value = ''
  successMessage.value = ''
}

// Initialize form from URL parameters
onMounted(() => {
  // Redirect if already authenticated
  if (isAuthenticated.value) {
    router.push('/')
    return
  }

  // Get token and email from URL parameters
  const token = route.query.token as string
  const email = route.query.email as string

  if (!token || !email) {
    invalidToken.value = true
    return
  }

  form.value.token = token
  form.value.email = email
})

// Form submission
const handleResetPassword = async () => {
  clearMessages()

  // Validate form
  const isPasswordValid = validatePassword()
  const isPasswordConfirmationValid = validatePasswordConfirmation()

  if (!isPasswordValid || !isPasswordConfirmationValid) {
    return
  }

  try {
    const result = await resetPassword(
      form.value.token,
      form.value.email,
      form.value.password,
      form.value.passwordConfirmation
    )

    if (result.success) {
      successMessage.value =
        result.message || 'Password reset successfully! Redirecting to login...'

      // Clear the form
      form.value.password = ''
      form.value.passwordConfirmation = ''

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      if (result.error?.includes('Invalid or expired')) {
        invalidToken.value = true
      } else {
        error.value = result.error || 'Failed to reset password'
      }
    }
  } catch (e) {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Reset password error:', e)
  }
}

// Focus management for accessibility
const focusFirstError = () => {
  nextTick(() => {
    if (passwordError.value) {
      document.getElementById('password')?.focus()
    } else if (passwordConfirmationError.value) {
      document.getElementById('password_confirmation')?.focus()
    }
  })
}

// Watch for validation errors and focus management
watch([passwordError, passwordConfirmationError], () => {
  focusFirstError()
})

// Auto-clear success messages
watch(successMessage, newValue => {
  if (newValue) {
    setTimeout(() => {
      successMessage.value = ''
    }, 10000)
  }
})

// Auto-clear error messages
watch(error, newValue => {
  if (newValue) {
    setTimeout(() => {
      error.value = ''
    }, 8000)
  }
})
</script>
