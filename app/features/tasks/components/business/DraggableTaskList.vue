<template>
  <div>
    <draggable
      v-model="dragTasks"
      item-key="id"
      ghost-class="bg-gray-100"
      @end="handleReorder"
      :disabled="isSearching"
    >
      <template #item="{ element }">
        <div 
          class="mb-2"
          :class="{ 'cursor-move': !isSearching && sortBy === 'order' }"
        >
          <TaskItem
            :task="element"
            @delete-task="$emit('delete-task', $event)"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useTask } from '../../composables/useTask'
import { useNotification } from '../../../../shared/composables/useNotification'
import TaskItem from './TaskItem.vue'
import type { Task } from '../../stores/task'

const emit = defineEmits<{
  'delete-task': [task: Task]
}>()

const {
  filteredTasks,
  reorderTasks,
  isSearching,
  sortBy
} = useTask()

const { error, success } = useNotification()

// Use a ref to track the dragged tasks
const dragTasks = ref<Task[]>([])

// Watch for changes in filteredTasks and update dragTasks
watch(filteredTasks, (newTasks) => {
  dragTasks.value = [...newTasks]
}, { immediate: true })

const handleReorder = async () => {
  // Only reorder if we're in custom order mode and not searching
  if (!isSearching.value && sortBy.value === 'order') {
    try {
      const result = await reorderTasks(dragTasks.value)
      
      if (result) {
        success('Task order saved successfully')
      } else {
        error('Failed to save task order. Please try again.')
      }
    } catch (err) {
      console.error('❌ Reorder error:', err)
      error('Failed to save task order. Please try again.')
    }
  }
}
</script>
