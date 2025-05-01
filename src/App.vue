<template>
  <div v-if="isInitializing">
    <Loader />
  </div>
  <RouterView />
  <Toaster position="top-right" theme="light" />
</template>

<script setup lang="ts">
import Loader from './components/Loader.vue'
import { Toaster } from 'vue-sonner'
import { useSessionFlags } from './composables/useSessionFlags'

// ✅ definir el store correctamente
const { isInitializing } = useSessionFlags()
</script>
