<template>
  <div class="bg-white p-4 shadow-md rounded-lg border border-gray-200 text-center">
    <h3 class="text-sm text-gray-500 font-semibold tracking-wide uppercase">{{ title }}</h3>
    <p class="text-3xl font-bold text-gray-900 mt-2">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; value: number }>()
</script>
