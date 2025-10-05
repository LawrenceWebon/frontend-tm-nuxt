<template>
  <div class="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <div class="w-12 h-12 flex items-center justify-center">
          <img :src="logoUrl" alt="Logo" class="h-8 w-8" />
        </div>
      </div>

      <!-- Login Card -->
      <div class="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-100">
        <!-- Page Title -->
        <h2 class="text-center text-2xl font-bold text-black mb-2">
          {{ pageTitle }}
        </h2>

        <!-- Page Subtitle -->
        <p class="text-center text-sm text-gray-600 mb-8">
          {{ pageSubtitle }}
        </p>

        <!-- Form Content -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import logoImage from '../../assets/images/logo.svg'

// Logo URL
const logoUrl = computed(() => logoImage)

// Get current route
const route = useRoute()

// Dynamic titles based on route
const pageTitle = computed(() => {
  switch (route.name) {
    case 'register':
      return 'Sign Up'
    case 'forgot-password':
      return 'Forgot Password'
    case 'reset-password':
      return 'Reset Password'
    default:
      return 'Sign In'
  }
})

const pageSubtitle = computed(() => {
  switch (route.name) {
    case 'register':
      return 'Create your account to get started'
    case 'forgot-password':
      return 'Enter your email to receive a reset link'
    case 'reset-password':
      return 'Enter your new password below'
    default:
      return 'Login to continue using this app'
  }
})
</script>
