<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <Notification
      v-for="notification in notifications"
      :key="notification.id"
      :message="notification.message"
      :type="notification.type"
      :duration="notification.duration"
      @close="remove(notification.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '../../composables/useNotification'

const { notifications, remove } = useNotification()
</script>
