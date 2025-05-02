<template>
  <div class="h-screen overflow-y flex">
    <Sidebar :links="employeeSidebarLinks" class="bg-[#fff4cc] text-black" />
    <main class="flex-1 bg-[#fafafa] p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { employeeSidebarLinks } from '../router/sidebarLinks';
import Sidebar from '../components/Sidebar.vue';
</script>
