<template>
  <div class="flex min-h-screen relative">
    <!-- Backdrop para móviles -->
    <div v-if="isMobile && showSidebar" @click="closeSidebar"
      class="fixed inset-0 z-40 md:hidden bg-gradient-to-r from-black/40 via-black/20 to-transparent backdrop-blur-sm transition-opacity duration-300">
    </div>


    <!-- Sidebar -->
    <aside :style="{ width: isCollapsed ? '5rem' : '16rem' }" :class="[
      'transition-[width] duration-300 ease-in-out',
      'bg-[#fff7dc] text-black py-6 flex flex-col justify-between shadow-lg z-50',
      isCollapsed ? 'items-center px-2' : 'px-4',
      isMobile
        ? 'fixed top-0 left-0 h-full transform transition-transform'
        : 'relative min-h-screen',
      isMobile && !showSidebar ? '-translate-x-full' : 'translate-x-0'
    ]">
      <div class="w-full">
        <!-- Botón colapsar -->
        <div class="flex justify-end mb-4 w-full">
          <button @click="toggleSidebarCollapse"
            class="p-2 rounded-full bg-white border border-gray-300 hover:bg-yellow-300 transition"
            :title="isCollapsed ? 'Expandir' : 'Colapsar'">
            <ChevronLeft v-if="!isCollapsed" class="w-5 h-5" />
            <ChevronRight v-else class="w-5 h-5" />
          </button>
        </div>

        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <img src="https://mansercom.pe/wp-content/themes/mansercom/images/logotipo.svg" alt="Mansercom Logo"
            class="transition-all duration-300" :class="isCollapsed ? 'w-10' : 'w-32'" />
        </div>

        <!-- Navegación -->
        <nav>
          <ul class="space-y-3">
            <li v-for="link in sidebarLinks" :key="link.to">
              <RouterLink :to="link.to" @click="handleMobileClose"
                class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[#fdd21f] hover:scale-[1.02] transform"
                :class="{
                  'bg-[#fdd21f] font-bold shadow-inner text-black':
                    isActiveLink(link.to),
                  'justify-center': isCollapsed,
                }">
                <component :is="link.icon" class="w-5 h-5"> </component>
                <span v-if="!isCollapsed" class="whitespace-nowrap">{{
                  link.label
                }}</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Logout -->
      <button @click="logout"
        class="mt-8 py-3 w-full bg-red-600 hover:bg-red-700 transition-colors duration-300 rounded-lg font-semibold tracking-wide shadow-md text-white text-sm flex items-center justify-center gap-2"
        :class="{ 'px-2': isCollapsed }">
        <LogOut class="w-5 h-5" />
        <span v-if="!isCollapsed">Cerrar sesión</span>
      </button>
    </aside>

    <!-- Contenido -->
    <div class="flex-1 bg-[#f9f9f9]">
      <!-- Header en móvil -->
      <header class="p-4 md:hidden">
        <button @click="toggleSidebarMobile" class="text-black">
          <Menu class="w-6 h-6"> </Menu>
        </button>
      </header>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProfileStore } from "../stores/profileStore";
import { sidebarLinksByRole, type SidebarLink } from "../router/sidebarLinks";
import { useAuthStore } from "../stores/authStore";
import { AuthRoutes } from "../router/routeNames";
import { ChevronLeft, ChevronRight, LogOut, Menu } from "lucide-vue-next";

const profile = useProfileStore();
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

// Responsive
const isMobile = ref(false);
const showSidebar = ref(true);
const isCollapsed = ref(false);

function toggleSidebarCollapse() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleSidebarMobile() {
  showSidebar.value = !showSidebar.value;
}

function closeSidebar() {
  showSidebar.value = false;
}

function handleResize() {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    showSidebar.value = true;
  } else {
    showSidebar.value = false;
  }
}

function handleMobileClose() {
  if (isMobile.value) closeSidebar();
}

function logout() {
  auth.logout();
  router.push(AuthRoutes.LOGIN);
  handleMobileClose();
}

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const sidebarLinks = computed<SidebarLink[]>(() => {
  if (!profile.role) return [];
  return sidebarLinksByRole[profile.role] || [];
});

function isActiveLink(path: string) {
  return route.path.startsWith(path);
}
</script>

<style scoped>
aside {
  overflow: hidden;
}
</style>
