<template>
  <li class="flex items-center p-3 bg-white rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <!-- Drag handle slot -->
    <slot name="handle"></slot>

    <!-- Checkbox -->
    <button
      @click="toggleTask(task.id)"
      class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4 hover:border-gray-400 transition-colors"
      :class="{ 'bg-black border-black': task.status === 'completed' }"
    >
      <svg
        v-if="task.status === 'completed'"
        class="w-4 h-4 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
    </button>

    <!-- Task Text -->
    <div class="flex-1">
      <div class="flex items-center">
        <p
          class="text-gray-900"
          :class="{ 'line-through text-gray-500': task.status === 'completed' }"
        >
          {{ task.title }}
        </p>
        <div class="flex items-center gap-2 mt-1">
          <!-- Priority Selection -->
          <div class="flex items-center ml-2">
            <div class="relative">
              <button
                @click="togglePriorityMenu(task.id)"
                class="flex items-center text-xs rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :class="{
                  'bg-red-100 text-red-800': task.priority === 'high',
                  'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                  'bg-green-100 text-green-800': task.priority === 'low'
                }"
              >
                {{ task.priority }}
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Priority dropdown menu -->
              <div
                v-if="priorityMenuOpen === task.id"
                class="absolute right-0 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <button
                    @click="updatePriority(task.id, 'high')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100': task.priority === 'high' }"
                    role="menuitem"
                  >
                    High
                  </button>
                  <button
                    @click="updatePriority(task.id, 'medium')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100': task.priority === 'medium' }"
                    role="menuitem"
                  >
                    Medium
                  </button>
                  <button
                    @click="updatePriority(task.id, 'low')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100': task.priority === 'low' }"
                    role="menuitem"
                  >
                    Low
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Show date when in search mode -->
          <p v-if="isSearching" class="text-xs text-gray-500">
            {{ formatDate(task.date) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Delete Button -->
    <button
      @click="confirmDelete(task)"
      class="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
    </button>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTask } from '~/composables/useTask'
import type { Task } from '~/stores/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  'delete-task': [taskId: number]
}>()

const { 
  isSearching, 
  updateTask, 
  updateTaskPriority 
} = useTask()

// Priority menu state
const priorityMenuOpen = ref<number | null>(null)

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Priority menu actions
const togglePriorityMenu = (taskId: number) => {
  priorityMenuOpen.value = priorityMenuOpen.value === taskId ? null : taskId
}

const updatePriority = async (taskId: number, priority: 'high' | 'medium' | 'low') => {
  try {
    await updateTaskPriority(taskId, priority)
    priorityMenuOpen.value = null
  } catch (error) {
    console.error('Failed to update task priority:', error)
    alert('Failed to update task priority. Please try again.')
  }
}

const toggleTask = async (taskId: number) => {
  try {
    const newStatus = props.task.status === 'completed' ? 'pending' : 'completed'
    
    await updateTask(taskId, {
      ...props.task,
      status: newStatus
    })
  } catch (error) {
    console.error('Failed to update task:', error)
    alert('Failed to update task. Please try again.')
  }
}

const confirmDelete = (task: Task) => {
  emit('delete-task', task.id)
}
</script>
