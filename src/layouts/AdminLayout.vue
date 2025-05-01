<template>
  <div class="min-h-screen flex">
    <Sidebar :links="adminSidebarLinks" class="bg-[#fff4cc] text-black" />
    <main class="flex-1 bg-[#fafafa] p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { adminSidebarLinks } from '../router/sidebarLinks';
import Sidebar from '../components/Sidebar.vue';
</script>
