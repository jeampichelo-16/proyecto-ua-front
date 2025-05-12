<template>
  <div class="flex min-h-screen">
    <Sidebar :links="employeeSidebarLinks" class="bg-[#fff4cc] text-black" />
    <main class="flex-1 bg-[#fafafa] p-6 pt-16 md:pt-0 overflow-y-auto max-h-screen">
  <RouterView />
</main>
  </div>
</template>

<script setup lang="ts">
import { employeeSidebarLinks } from '../router/sidebarLinks';
import Sidebar from '../components/Sidebar.vue';
</script>
