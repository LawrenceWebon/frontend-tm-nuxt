<template>
  <aside class="w-64 bg-white flex flex-col">
    <nav class="p-4 overflow-y-auto flex-1 scrollbar-hide" @scroll="handleSidebarScroll">
      <div class="space-y-1">
        <!-- Today (Active) -->
        <div
          @click="selectDateFilter('today')"
          class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
          :class="
            selectedDateFilter === 'today'
              ? 'bg-black text-white'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          Today
        </div>

        <!-- Yesterday -->
        <div
          @click="selectDateFilter('yesterday')"
          class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
          :class="
            selectedDateFilter === 'yesterday'
              ? 'bg-black text-white'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          Yesterday
        </div>

        <!-- Day before yesterday -->
        <div
          @click="selectDateFilter('dayBeforeYesterday')"
          class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
          :class="
            selectedDateFilter === 'dayBeforeYesterday'
              ? 'bg-black text-white'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          {{ formatDateForDisplay(dayBeforeYesterday) }}
        </div>

        <!-- Last week section -->
        <div class="pt-4">
          <div class="text-gray-400 text-xs font-medium px-3 py-1 tracking-wide">Last week</div>
          <div class="space-y-1 mt-2">
            <div
              v-for="(day, index) in lastWeekDays"
              :key="index"
              @click="selectDateFilter('specific', day.date)"
              class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="
                selectedDateFilter === 'specific' && selectedSpecificDate === day.date
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              "
            >
              {{ day.display }}
            </div>
          </div>
        </div>

        <!-- Week before last section -->
        <div class="pt-4">
          <div class="text-gray-400 text-xs font-medium px-3 py-1 tracking-wide">
            {{ getWeekNumber(weekBeforeLastDays[0].date) }} Week of
            {{ new Date(weekBeforeLastDays[0].date).toLocaleString('default', { month: 'long' }) }}
          </div>
          <div class="space-y-1 mt-2">
            <div
              v-for="(day, index) in weekBeforeLastDays"
              :key="index"
              @click="selectDateFilter('specific', day.date)"
              class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="
                selectedDateFilter === 'specific' && selectedSpecificDate === day.date
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              "
            >
              {{ day.display }}
            </div>
          </div>
        </div>

        <!-- Additional weeks sections -->
        <div v-for="(week, weekIndex) in additionalWeeks" :key="`week-${weekIndex}`" class="pt-4">
          <div class="text-gray-400 text-xs font-medium px-3 py-1 tracking-wide">
            {{ week.weekNumber }} Week of {{ week.monthName }}
          </div>
          <div class="space-y-1 mt-2">
            <div
              v-for="(day, dayIndex) in week.days"
              :key="`${weekIndex}-${dayIndex}`"
              @click="selectDateFilter('specific', day.date)"
              class="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="
                selectedDateFilter === 'specific' && selectedSpecificDate === day.date
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              "
            >
              {{ day.display }}
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoadingMoreWeeks" class="pt-4">
          <div class="flex items-center justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
            <span class="ml-2 text-sm text-gray-500">Loading more dates...</span>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTask } from '../../features/tasks/composables/useTask'
import { useDateFilter } from '../composables/useDateFilter'
// frontend-nuxt4/app/shared/composables/useDateFilter.ts
// Task management
const { setCurrentDate } = useTask()

// Date filtering state - now shared
const { 
  selectedDateFilter, 
  selectedSpecificDate, 
  today, 
  yesterday, 
  dayBeforeYesterday,
  setDateFilter,
  getCurrentDate,
  formatDateForDisplay
} = useDateFilter()

// Infinite scrolling state
const additionalWeeks = ref([])
const isLoadingMoreWeeks = ref(false)
const currentWeekOffset = ref(15) // Start from 15 days ago (after week before last which is 8-14 days)
const hasMoreWeeks = ref(true)

// Date filtering computed properties are now imported from useDateFilter

const lastWeekDays = computed(() => {
  const days = []
  const today = new Date()

  // Get last week (1 day ago to 7 days ago) - most recent first
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

    days.push({
      date: dateString,
      display: `${dayName}, ${monthDay}`
    })
  }

  return days
})

const weekBeforeLastDays = computed(() => {
  const days = []
  const today = new Date()

  // Get week before last (8 days ago to 14 days ago) - most recent first
  for (let i = 8; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

    days.push({
      date: dateString,
      display: `${dayName}, ${monthDay}`
    })
  }

  return days
})

// Date filtering methods
const selectDateFilter = (filterType, specificDate = null) => {
  setDateFilter(filterType, specificDate || '')
  
  const targetDate = getCurrentDate()
  setCurrentDate(targetDate)
}

// formatDateForDisplay is now imported from useDateFilter

const getWeekNumber = dateString => {
  const date = new Date(dateString)
  const dayOfMonth = date.getDate()
  const weekNumber = Math.ceil(dayOfMonth / 7)

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, 5th, etc.)
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = weekNumber % 100
  return weekNumber + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

// Generate days for a specific week (7 days starting from weekOffset)
const generateWeekDays = weekOffset => {
  const days = []
  const today = new Date()

  // Generate 7 days starting from weekOffset days ago
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - (weekOffset + i))
    const dateString = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

    days.push({
      date: dateString,
      display: `${dayName}, ${monthDay}`
    })
  }

  return days
}

// Load more weeks
const loadMoreWeeks = async () => {
  if (isLoadingMoreWeeks.value || !hasMoreWeeks.value) return

  isLoadingMoreWeeks.value = true

  try {
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800))

    const weekDays = generateWeekDays(currentWeekOffset.value)
    const firstDayDate = new Date(weekDays[0].date)
    const monthName = firstDayDate.toLocaleString('default', { month: 'long' })
    const weekNumber = getWeekNumber(weekDays[0].date)

    const newWeek = {
      weekOffset: currentWeekOffset.value,
      monthName,
      weekNumber,
      days: weekDays
    }

    additionalWeeks.value.push(newWeek)
    currentWeekOffset.value += 7 // Move to next week

    // Limit to 52 weeks back (1 year)
    if (currentWeekOffset.value > 365) {
      hasMoreWeeks.value = false
    }
  } catch (error) {
    console.error('Error loading more weeks:', error)
  } finally {
    isLoadingMoreWeeks.value = false
  }
}

// Handle scroll events for infinite loading
const handleSidebarScroll = event => {
  const { scrollTop, scrollHeight, clientHeight } = event.target

  // Load more when user scrolls to within 100px of the bottom
  if (
    scrollHeight - scrollTop - clientHeight < 100 &&
    hasMoreWeeks.value &&
    !isLoadingMoreWeeks.value
  ) {
    loadMoreWeeks()
  }
}

// Expose the selected date filter for parent components
defineExpose({
  selectedDateFilter,
  selectedSpecificDate
})
</script>
