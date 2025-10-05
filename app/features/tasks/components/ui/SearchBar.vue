<template>
  <div class="relative">
    <label for="search-input" class="sr-only">Search tasks</label>
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg 
        class="h-5 w-5 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <input
      id="search-input"
      ref="searchInput"
      v-model="query"
      type="text"
      placeholder="Search tasks..."
      role="searchbox"
      aria-label="Search tasks"
      aria-describedby="search-help"
      class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-blue-500 sm:text-sm"
      @input="debouncedSearch"
      @keydown="handleKeydown"
    />

    <button
      v-if="query"
      ref="clearButton"
      @click="clearSearchQuery"
      type="button"
      aria-label="Clear search"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 rounded-md"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Screen reader help text -->
    <div id="search-help" class="sr-only">
      Type to search through your tasks. Use Enter to search or Escape to clear.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue'
import { useTask } from '../../composables/useTask'

const { searchTasks, clearSearch } = useTask()

const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const clearButton = ref<HTMLButtonElement | null>(null)
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
  // Focus back to search input after clearing
  nextTick(() => {
    searchInput.value?.focus()
  })
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      if (query.value) {
        clearSearchQuery()
        event.preventDefault()
      }
      break
    case 'Enter':
      // Trigger immediate search on Enter
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      searchTasks(query.value)
      event.preventDefault()
      break
    case 'Tab':
      // Allow normal tab navigation
      break
    default:
      // For other keys, let the input handle them normally
      break
  }
}

// Clear search when component is unmounted
onUnmounted(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  clearSearch()
})
</script>
