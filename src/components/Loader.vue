<!-- src/components/Loader.vue -->
<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p class="text-gray-600 text-lg">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ message?: string }>()
  </script>
  