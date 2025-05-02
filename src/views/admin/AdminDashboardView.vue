<template>
  <div class="p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Panel Administrativo</h1>
      
    </div>

    <p class="mt-2 text-gray-600">Vista exclusiva para administradores.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('[DashboardView] cargado')
})
</script>
