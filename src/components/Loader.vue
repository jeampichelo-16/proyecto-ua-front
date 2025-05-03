<template>
  <div class="flex items-center justify-center w-full h-full py-8">
    <div class="flex flex-col items-center space-y-3">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-yellow-500 border-t-transparent"></div>
      <p v-if="message" class="text-gray-700 text-sm">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()
</script>
