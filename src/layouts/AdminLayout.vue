<template>
  <div class="flex min-h-screen">
    <Sidebar :links="adminSidebarLinks" class="bg-[#fff4cc] text-black" />
    
    <!-- Establece altura y overflow para el contenido principal -->
    <main class="flex-1 bg-[#fafafa] p-6 pt-16 md:pt-0 overflow-y-auto max-h-screen">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { adminSidebarLinks } from '../router/sidebarLinks'
import Sidebar from '../components/Sidebar.vue'
</script>
