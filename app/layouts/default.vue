<template>
  <div class="h-screen bg-white flex flex-col">
    <!-- Header -->
    <AppHeader />

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <slot />
      </main>
    </div>

    <!-- Global Modals -->
    <slot name="modals" />

    <!-- Notification Container -->
    <NotificationContainer />
  </div>
</template>

<script setup>
// Default layout for authenticated pages
// This layout provides the main structure with header, sidebar, and content area
import AppHeader from '../shared/components/AppHeader.vue'
import AppSidebar from '../shared/components/AppSidebar.vue'
import NotificationContainer from '../shared/components/feedback/NotificationContainer.vue'
</script>
