<template>
  <component v-if="layoutComponent" :is="layoutComponent" />
  <div v-else class="flex items-center justify-center min-h-screen text-gray-600">
    <span class="text-lg font-medium">Cargando interfaz...</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AdminLayout from './AdminLayout.vue'
import EmployeeLayout from './EmployeeLayout.vue'
import { Role } from '../types/user'
import { useProfileStore } from '../stores/profileStore'

const profile = useProfileStore()

const layoutComponent = computed(() => {
  if (profile.role === Role.ADMIN) return AdminLayout
  if (profile.role === Role.EMPLEADO) return EmployeeLayout
  return null
})
</script>
