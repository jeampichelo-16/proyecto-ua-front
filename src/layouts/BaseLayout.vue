<!-- src/layouts/BaseLayout.vue -->
<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AdminLayout from './AdminLayout.vue'
import EmployeeLayout from './EmployeeLayout.vue'
import { Role } from '../types/user'
import { useProfileStore } from '../stores/profileStore'

const { role } = useProfileStore()

const layoutComponent = computed(() => {
  if (role === Role.ADMIN) return AdminLayout
  if (role === Role.EMPLEADO) return EmployeeLayout
  return null
})
</script>
