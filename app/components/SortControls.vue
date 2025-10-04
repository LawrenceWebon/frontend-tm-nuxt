<template>
  <div class="flex items-center space-x-2">
    <span class="text-sm text-gray-500">Sort by:</span>
    <div class="flex space-x-1">
      <button
        @click="setSortBy('order')"
        class="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
        :class="{
          'bg-gray-200 text-black': sortBy === 'order',
          'hover:bg-gray-100': sortBy !== 'order'
        }"
      >
        Custom
      </button>
      <button
        @click="setSortBy('priority')"
        class="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
        :class="{
          'bg-gray-200 text-black': sortBy === 'priority',
          'hover:bg-gray-100': sortBy !== 'priority'
        }"
      >
        Priority
      </button>
      <button
        @click="setSortBy('title')"
        class="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
        :class="{
          'bg-gray-200 text-black': sortBy === 'title',
          'hover:bg-gray-100': sortBy !== 'title'
        }"
      >
        Alphabetical
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTask } from '../composables/useTask'

const { sortBy, setSortBy } = useTask()
</script>
