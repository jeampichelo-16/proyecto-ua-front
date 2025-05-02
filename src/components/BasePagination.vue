<template>
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 text-sm text-gray-700">
      <button
        :disabled="currentPage === 1"
        @click="$emit('update:page', currentPage - 1)"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        ← Anterior
      </button>
  
      <span class="text-center text-gray-600 font-medium">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
  
      <button
        :disabled="!hasNextPage"
        @click="$emit('update:page', currentPage + 1)"
        class="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Siguiente →
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    currentPage: number
    totalPages: number
    hasNextPage: boolean
  }>()
  
  defineEmits<{
    (e: 'update:page', newPage: number): void
  }>()
  </script>
  