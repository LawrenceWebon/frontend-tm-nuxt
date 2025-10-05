<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <input
      v-model="query"
      type="text"
      placeholder="Search tasks..."
      class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-gray-200 focus:border-gray-200 sm:text-sm"
      @input="debouncedSearch"
    />

    <button
      v-if="query"
      @click="clearSearchQuery"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useTask } from '../../composables/useTask'

const { searchTasks, clearSearch } = useTask()

const query = ref('')
let debounceTimeout: NodeJS.Timeout | null = null

const debouncedSearch = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  debounceTimeout = setTimeout(() => {
    searchTasks(query.value)
  }, 300)
}

const clearSearchQuery = () => {
  query.value = ''
  clearSearch()
}

// Clear search when component is unmounted
onUnmounted(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  clearSearch()
})
</script>
