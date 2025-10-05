<template>
  <div class="flex items-center space-x-2">
    <span class="text-sm text-gray-500">Sort by:</span>
    <div class="flex space-x-1" role="group" aria-label="Sort options">
      <button
        @click="setSortBy('order')"
        @keydown.enter="setSortBy('order')"
        @keydown.space.prevent="setSortBy('order')"
        type="button"
        :aria-pressed="sortBy === 'order'"
        :aria-label="`Sort by custom order${sortBy === 'order' ? ' (current)' : ''}`"
        class="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        :class="{
          'bg-gray-200 text-black': sortBy === 'order',
          'hover:bg-gray-100': sortBy !== 'order'
        }"
      >
        Custom
      </button>
      <button
        @click="setSortBy('priority')"
        @keydown.enter="setSortBy('priority')"
        @keydown.space.prevent="setSortBy('priority')"
        type="button"
        :aria-pressed="sortBy === 'priority'"
        :aria-label="`Sort by priority${sortBy === 'priority' ? ' (current)' : ''}`"
        class="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        :class="{
          'bg-gray-200 text-black': sortBy === 'priority',
          'hover:bg-gray-100': sortBy !== 'priority'
        }"
      >
        Priority
      </button>
      <button
        @click="setSortBy('title')"
        @keydown.enter="setSortBy('title')"
        @keydown.space.prevent="setSortBy('title')"
        type="button"
        :aria-pressed="sortBy === 'title'"
        :aria-label="`Sort alphabetically${sortBy === 'title' ? ' (current)' : ''}`"
        class="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
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
import { useTask } from '../../composables/useTask'

const { sortBy, setSortBy } = useTask()
</script>
