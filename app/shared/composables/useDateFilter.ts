import { ref, computed } from 'vue'

// Create a function to initialize date filter state
const createDateFilterState = () => ({
  selectedDateFilter: ref('today'),
  selectedSpecificDate: ref('')
})

// Global state instance
let dateFilterState = createDateFilterState()
let hasBeenReset = false

// Function to reset date filter state (call on logout/login)
export const resetDateFilterState = () => {
  dateFilterState = createDateFilterState()
  hasBeenReset = true
}

// Function to check if state has been reset for current session
export const hasDateFilterBeenReset = () => hasBeenReset

// Get current state
const { selectedDateFilter, selectedSpecificDate } = dateFilterState

// Date computations
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const yesterday = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
})

const dayBeforeYesterday = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() - 2)
  return date.toISOString().split('T')[0]
})

// Date formatting utility
const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  return `${dayName}, ${monthDay}`
}

// Placeholder text generator
const getPlaceholderText = () => {
  switch (dateFilterState.selectedDateFilter.value) {
    case 'today':
      return 'today'
    case 'yesterday':
      return 'yesterday'
    case 'dayBeforeYesterday':
      return `on ${formatDateForDisplay(dayBeforeYesterday.value || '')}`
    case 'specific':
      return `on ${formatDateForDisplay(dateFilterState.selectedSpecificDate.value || '')}`
    default:
      return 'today'
  }
}

// Date filter functions
const setDateFilter = (filterType: string, specificDate: string = '') => {
  dateFilterState.selectedDateFilter.value = filterType
  dateFilterState.selectedSpecificDate.value = specificDate
}

const getCurrentDate = () => {
  switch (dateFilterState.selectedDateFilter.value) {
    case 'today':
      return today.value
    case 'yesterday':
      return yesterday.value
    case 'dayBeforeYesterday':
      return dayBeforeYesterday.value
    case 'specific':
      return dateFilterState.selectedSpecificDate.value
    default:
      return today.value
  }
}

export const useDateFilter = () => {
  return {
    // State
    selectedDateFilter: dateFilterState.selectedDateFilter,
    selectedSpecificDate: dateFilterState.selectedSpecificDate,
    
    // Computed dates
    today,
    yesterday,
    dayBeforeYesterday,
    
    // Functions
    setDateFilter,
    getCurrentDate,
    getPlaceholderText,
    formatDateForDisplay
  }
}
