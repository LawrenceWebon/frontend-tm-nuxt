<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center">
        <div class="w-12 h-12 rounded-sm flex items-center justify-center">
          <img :src="logoUrl" alt="Logo" class="h-8 w-8" />
        </div>
      </div>

      <!-- Page Title -->
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        <slot name="title">Welcome</slot>
      </h2>

      <!-- Page Subtitle -->
      <p class="mt-2 text-center text-sm text-gray-600">
        <slot name="subtitle">Please sign in to your account</slot>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
</script>
