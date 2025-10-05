<template>
  <li class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">

    <!-- Checkbox -->
    <button
      @click="toggleTask(task.id)"
      class="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 hover:border-gray-400 transition-colors flex-shrink-0"
      :class="{ 
        'bg-black border-black': task.status === 'completed',
        'border-gray-300 bg-white': task.status !== 'completed'
      }"
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
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <!-- Editable Title -->
        <div v-if="isEditing && task.status !== 'completed'" class="flex-1 min-w-0">
          <input
            ref="titleInput"
            v-model="editingTitle"
            @keyup.enter="saveTitle"
            @blur="saveTitle"
            @keyup.escape="cancelEdit"
            class="w-full px-2 py-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-sm"
          />
        </div>
        <!-- Display Title -->
        <p
          v-else
          @click="startEdit"
          class="text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors text-sm flex-1 min-w-0"
          :class="{ 
            'line-through text-gray-500': task.status === 'completed',
            'cursor-not-allowed': task.status === 'completed'
          }"
        >
          {{ task.title }}
        </p>
        <div class="flex items-center gap-2 ml-2 flex-shrink-0">
          <!-- Priority Selection -->
          <div class="flex items-center ml-2 mr-2">
            <div class="relative">
              <button
                @click="task.status !== 'completed' ? togglePriorityMenu(task.id) : null"
                :disabled="task.status === 'completed'"
                class="flex items-center text-xs rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                :class="{
                  'bg-red-100 text-red-800': task.priority === 'high',
                  'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                  'bg-green-100 text-green-800': task.priority === 'low',
                  'opacity-50 cursor-not-allowed': task.status === 'completed',
                  'hover:opacity-80': task.status !== 'completed'
                }"
              >
                {{ task.priority }}
                <svg 
                  class="w-3 h-3 ml-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  :class="{ 'opacity-50': task.status === 'completed' }"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Priority dropdown menu -->
              <div
                v-if="priorityMenuOpen === task.id"
                class="absolute right-0 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-gray-200 ring-opacity-5 z-10"
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
      class="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
    </button>
  </li>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useTask } from '../../composables/useTask'
import type { Task } from '../../stores/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  'delete-task': [task: Task]
}>()

const { 
  isSearching, 
  updateTask, 
  updateTaskPriority 
} = useTask()

// Computed property to avoid TypeScript comparison issues
const isCompleted = computed(() => props.task.status === 'completed')

// Priority menu state
const priorityMenuOpen = ref<number | null>(null)

// Title editing state
const isEditing = ref(false)
const editingTitle = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Priority menu actions
const togglePriorityMenu = (taskId: number) => {
  // Don't open menu for completed tasks
  if (props.task.status === 'completed') return
  
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
  emit('delete-task', task)
}

// Title editing methods
const startEdit = () => {
  if (props.task.status === 'completed') return
  
  isEditing.value = true
  editingTitle.value = props.task.title
  
  nextTick(() => {
    titleInput.value?.focus()
    titleInput.value?.select()
  })
}

const saveTitle = async () => {
  if (!isEditing.value) return
  
  const newTitle = editingTitle.value.trim()
  
  // Don't save if title is empty or unchanged
  if (!newTitle || newTitle === props.task.title) {
    cancelEdit()
    return
  }
  
  try {
    await updateTask(props.task.id, {
      ...props.task,
      title: newTitle
    })
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update task title:', error)
    alert('Failed to update task title. Please try again.')
    cancelEdit()
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editingTitle.value = ''
}
</script>
