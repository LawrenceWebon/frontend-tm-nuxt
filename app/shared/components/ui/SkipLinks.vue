<template>
  <div class="skip-links">
    <a href="#main-content" class="skip-link" @click="focusElement('#main-content')">
      Skip to main content
    </a>
    <a href="#navigation" class="skip-link" @click="focusElement('#navigation')">
      Skip to navigation
    </a>
    <a href="#search" class="skip-link" @click="focusElement('#search')">Skip to search</a>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

const focusElement = async (selector: string) => {
  await nextTick()
  const element = document.querySelector(selector) as HTMLElement
  if (element) {
    element.focus()
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.skip-links {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 1000;
}

.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  font-weight: bold;
  border-radius: 0 0 4px 0;
  transform: translateY(-100%);
  transition: transform 0.2s ease-in-out;
}

.skip-link:focus {
  transform: translateY(0);
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.skip-link:hover {
  background: #333;
}
</style>
