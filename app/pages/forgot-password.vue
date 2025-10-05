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

    <!-- Forgot Password Form -->
    <form @submit.prevent="handleForgotPassword" class="space-y-6" novalidate>

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm text-black mb-2">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
          :class="[
            'w-full px-3 py-1.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors text-sm',
            emailError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          ]"
          placeholder="Enter your email address"
          :disabled="isLoading"
          @blur="validateEmail"
          @input="clearFieldError('email')"
          aria-describedby="email-error"
        />
        <p v-if="emailError" id="email-error" class="mt-2 text-sm text-red-600">
          {{ emailError }}
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
        {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
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

// Redirect if already authenticated
definePageMeta({
  layout: 'auth',
  middleware: []
})

const { requestPasswordReset, isAuthenticated, isLoading: authLoading } = useAuth()
const router = useRouter()

// Redirect if already authenticated
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/')
  }
})

// Form state
const form = ref({
  email: ''
})

// UI state
const error = ref('')
const successMessage = ref('')
const emailError = ref('')

// Computed properties
const isLoading = computed(() => authLoading.value)
const isFormValid = computed(() => {
  return form.value.email && !emailError.value && isValidEmail(form.value.email)
})

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateEmail = () => {
  if (!form.value.email) {
    emailError.value = 'Email address is required'
    return false
  }
  if (!isValidEmail(form.value.email)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }
  emailError.value = ''
  return true
}

const clearFieldError = (field: string) => {
  if (field === 'email') {
    emailError.value = ''
  }
}

const clearMessages = () => {
  error.value = ''
  successMessage.value = ''
}

// Form submission
const handleForgotPassword = async () => {
  clearMessages()

  // Validate form
  const isEmailValid = validateEmail()

  if (!isEmailValid) {
    return
  }

  try {
    const result = await requestPasswordReset(form.value.email)

    if (result.success) {
      successMessage.value = result.message || 'Password reset link sent! Check your email.'

      // Clear the form
      form.value.email = ''
    } else {
      error.value = result.error || 'Failed to send reset email'
    }
  } catch (e) {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Forgot password error:', e)
  }
}

// Focus management for accessibility
const focusFirstError = () => {
  nextTick(() => {
    if (emailError.value) {
      document.getElementById('email')?.focus()
    }
  })
}

// Watch for validation errors and focus management
watch(emailError, () => {
  focusFirstError()
})

// Auto-clear success messages
watch(successMessage, newValue => {
  if (newValue) {
    setTimeout(() => {
      successMessage.value = ''
    }, 10000) // Keep success message longer for password reset
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
