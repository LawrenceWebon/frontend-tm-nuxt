<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="w-96 bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      :class="notificationClasses"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <AlertCircle v-if="type === 'error'" class="h-6 w-6 text-red-400" />
            <CheckCircle v-else-if="type === 'success'" class="h-6 w-6 text-green-400" />
            <AlertTriangle v-else-if="type === 'warning'" class="h-6 w-6 text-yellow-400" />
            <Info v-else class="h-6 w-6 text-blue-400" />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p v-if="title" class="text-sm font-medium text-gray-900">{{ title }}</p>
            <p class="text-sm text-gray-500" :class="{ 'mt-1': title }">{{ message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="close"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

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
  },
  title: {
    type: String,
    default: undefined
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(true)
let timeout: NodeJS.Timeout | null = null

// Computed classes for different notification types
const notificationClasses = computed(() => {
  switch (props.type) {
    case 'error':
      return 'border-l-4 border-red-400'
    case 'success':
      return 'border-l-4 border-green-400'
    case 'warning':
      return 'border-l-4 border-yellow-400'
    case 'info':
    default:
      return 'border-l-4 border-blue-400'
  }
})

const close = () => {
  isVisible.value = false
  emit('close')
}

onMounted(() => {
  if (props.autoClose && props.duration > 0 && !props.persistent) {
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
