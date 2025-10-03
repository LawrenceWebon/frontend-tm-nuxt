<template>
  <div
    v-if="isVisible"
    class="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-md shadow-lg p-4 max-w-md"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <AlertCircle
          v-if="type === 'error'"
          :class="'text-red-500'"
          :size="20"
        />
        <CheckCircle
          v-else
          :class="'text-green-500'"
          :size="20"
        />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-900">{{ message }}</p>
      </div>
      <div class="ml-auto pl-3">
        <button
          @click="close"
          class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { AlertCircle, CheckCircle, X } from 'lucide-vue-next'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['info', 'success', 'error', 'warning'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(true)
let timeout: NodeJS.Timeout | null = null

const close = () => {
  isVisible.value = false
  emit('close')
}

onMounted(() => {
  if (props.autoClose && props.duration > 0) {
    timeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})
</script>
