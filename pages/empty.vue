<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 class="text-xl font-semibold text-gray-900">Task Manager</h1>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md mx-8">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <!-- User Profile -->
        <div class="flex items-center">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
        <nav class="p-6">
          <div class="space-y-1">
            <!-- Today (Active) -->
            <div class="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
              Today
            </div>
            
            <!-- Other dates -->
            <div class="space-y-1 mt-4">
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Yesterday
              </div>
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Sunday, July 27
              </div>
              
              <!-- Last week section -->
              <div class="text-gray-500 text-xs font-medium px-4 py-2 mt-6">
                Last week
              </div>
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Saturday, July 26
              </div>
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Friday, July 25
              </div>
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Thursday, July 24
              </div>
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Wednesday, July 23
              </div>
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Tuesday, July 22
              </div>
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Monday, July 21
              </div>
              <div class="text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg cursor-pointer">
                Sunday, July 20
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Task Input Section -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">What do you have in mind?</h2>
          <div class="relative">
            <textarea
              v-model="newTask"
              placeholder="Write the task you plan to do today here..."
              class="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              @keydown.ctrl.enter="addTask"
            ></textarea>
            <button
              @click="addTask"
              :disabled="!newTask.trim()"
              class="absolute bottom-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div class="text-center py-20">
          <div class="text-gray-300 mb-6">
            <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">No tasks yet</h3>
          <p class="text-gray-500 text-lg mb-8">Start by adding your first task above</p>
          <button
            @click="focusInput"
            class="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Task
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const { user, logout } = useAuth()
const { post } = useApi()

// State
const newTask = ref('')

// Methods
const addTask = async () => {
  if (!newTask.value.trim()) return

  try {
    const response = await post('/tasks', {
      title: newTask.value.trim(),
      date: new Date().toISOString().split('T')[0],
      priority: 'medium'
    })

    if (response.ok) {
      newTask.value = ''
      // Redirect to main page to show the new task
      await navigateTo('/')
    }
  } catch (error) {
    console.error('Failed to add task:', error)
  }
}

const focusInput = () => {
  const textarea = document.querySelector('textarea')
  if (textarea) {
    textarea.focus()
  }
}
</script>
