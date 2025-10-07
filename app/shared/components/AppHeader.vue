<template>
  <header
    class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0"
    role="banner"
  >
    <!-- Logo -->
    <div class="flex items-center">
      <div class="w-8 h-8 rounded-sm flex items-center justify-center">
        <img :src="logoUrl" alt="Task Management App Logo" />
      </div>
    </div>

    <!-- Search Bar -->
    <div class="flex-1 max-w-md mx-8">
      <SearchBar />
    </div>

    <!-- User Avatar with Dropdown -->
    <div class="relative">
      <button
        @click="toggleProfileDropdown"
        @keydown.enter="toggleProfileDropdown"
        @keydown.space.prevent="toggleProfileDropdown"
        @keydown.escape="showProfileDropdown = false"
        type="button"
        :aria-label="`User menu for ${user?.name || 'User'}`"
        :aria-expanded="showProfileDropdown"
        :aria-haspopup="true"
        class="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
      >
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showProfileDropdown"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
        role="menu"
        aria-label="User menu"
      >
        <div class="px-4 py-2 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-900">{{ user?.name || 'User' }}</p>
          <p class="text-xs text-gray-500">{{ user?.email || 'user@example.com' }}</p>
        </div>
        <button
          @click="handleLogout"
          @keydown.enter="handleLogout"
          @keydown.space.prevent="handleLogout"
          type="button"
          role="menuitem"
          aria-label="Logout from account"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-inset"
        >
          <svg
            class="w-4 h-4 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../../features/auth/composables/useAuth'
import { useRouter } from 'vue-router'
import logoImage from '../../../assets/images/logo.svg'
import SearchBar from '../../features/tasks/components/ui/SearchBar.vue'

// Authentication
const { user, logout } = useAuth()
const router = useRouter()

// Logo URL
const logoUrl = computed(() => logoImage)

// Profile dropdown state
const showProfileDropdown = ref(false)

// Profile dropdown actions
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const handleLogout = async () => {
  try {
    await logout()
    showProfileDropdown.value = false
    await router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close dropdown when clicking outside
const closeDropdown = event => {
  if (!event.target.closest('.relative')) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
