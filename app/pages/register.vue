<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <!-- Content -->
    <div class="px-6 w-[32rem]">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <div class="w-12 h-12 flex items-center justify-center">
          <img :src="logoUrl" alt="Logo" />
        </div>
      </div>

      <!-- Register Card -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm px-16 pb-24 pt-8">
        <!-- Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p class="text-gray-600">Sign up to start managing your tasks</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
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

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-6" novalidate>
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm text-black mb-2">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              :class="[
                'w-full px-3 py-1.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors text-sm',
                nameError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              ]"
              placeholder=""
              :disabled="isLoading"
              @blur="validateName"
              @input="clearFieldError('name')"
              aria-describedby="name-error"
            />
            <p v-if="nameError" id="name-error" class="mt-2 text-sm text-red-600">
              {{ nameError }}
            </p>
          </div>

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
              placeholder=""
              :disabled="isLoading"
              @blur="validateEmail"
              @input="clearFieldError('email')"
              aria-describedby="email-error"
            />
            <p v-if="emailError" id="email-error" class="mt-2 text-sm text-red-600">
              {{ emailError }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm text-black mb-2">Password</label>
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
              placeholder=""
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
            <label for="passwordConfirmation" class="block text-sm text-black mb-2">
              Confirm Password
            </label>
            <input
              id="passwordConfirmation"
              v-model="form.passwordConfirmation"
              type="password"
              required
              autocomplete="new-password"
              :class="[
                'w-full px-3 py-1.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors text-sm',
                passwordConfirmationError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              ]"
              placeholder=""
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

          <!-- Register Button -->
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
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink
              to="/login"
              class="font-medium text-black hover:text-gray-800 transition-colors focus:outline-none focus:underline"
            >
              Sign in here
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuth } from '../features/auth/composables/useAuth'
import logoImage from '../../assets/images/logo.svg'

// Redirect if already authenticated
definePageMeta({
  layout: false,
  middleware: []
})

const { register, isAuthenticated, isLoading: authLoading } = useAuth()
const router = useRouter()

// Logo URL
const logoUrl = computed(() => logoImage)

// Redirect if already authenticated
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/')
  }
})

// Form state
const form = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})

// UI state
const error = ref('')
const successMessage = ref('')
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const passwordConfirmationError = ref('')

// Computed properties
const isLoading = computed(() => authLoading.value)
const isFormValid = computed(() => {
  return (
    form.value.name &&
    form.value.email &&
    form.value.password &&
    form.value.passwordConfirmation &&
    !nameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !passwordConfirmationError.value &&
    isValidEmail(form.value.email) &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.passwordConfirmation
  )
})

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateName = () => {
  if (!form.value.name) {
    nameError.value = 'Full name is required'
    return false
  }
  if (form.value.name.trim().length < 2) {
    nameError.value = 'Name must be at least 2 characters long'
    return false
  }
  nameError.value = ''
  return true
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

const validatePassword = () => {
  if (!form.value.password) {
    passwordError.value = 'Password is required'
    return false
  }
  if (form.value.password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters long'
    return false
  }
  if (form.value.passwordConfirmation && form.value.password !== form.value.passwordConfirmation) {
    passwordConfirmationError.value = 'Passwords do not match'
  }
  passwordError.value = ''
  return true
}

const validatePasswordConfirmation = () => {
  if (!form.value.passwordConfirmation) {
    passwordConfirmationError.value = 'Please confirm your password'
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
  switch (field) {
    case 'name':
      nameError.value = ''
      break
    case 'email':
      emailError.value = ''
      break
    case 'password':
      passwordError.value = ''
      break
    case 'passwordConfirmation':
      passwordConfirmationError.value = ''
      break
  }
}

const clearMessages = () => {
  error.value = ''
  successMessage.value = ''
}

// Form submission
const handleRegister = async () => {
  clearMessages()

  // Validate form
  const isNameValid = validateName()
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  const isPasswordConfirmationValid = validatePasswordConfirmation()

  if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmationValid) {
    return
  }

  try {
    const result = await register(
      form.value.name,
      form.value.email,
      form.value.password,
      form.value.passwordConfirmation
    )

    if (result.success) {
      successMessage.value = 'Account created successfully! Redirecting...'

      // Redirect after a short delay
      setTimeout(async () => {
        await router.push('/')
      }, 1500)
    } else {
      error.value = result.error || 'Registration failed'
    }
  } catch (e) {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Registration error:', e)
  }
}

// Focus management for accessibility
const focusFirstError = () => {
  nextTick(() => {
    if (nameError.value) {
      document.getElementById('name')?.focus()
    } else if (emailError.value) {
      document.getElementById('email')?.focus()
    } else if (passwordError.value) {
      document.getElementById('password')?.focus()
    } else if (passwordConfirmationError.value) {
      document.getElementById('passwordConfirmation')?.focus()
    }
  })
}

// Watch for validation errors and focus management
watch([nameError, emailError, passwordError, passwordConfirmationError], () => {
  focusFirstError()
})

// Auto-clear success messages
watch(successMessage, newValue => {
  if (newValue) {
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
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
