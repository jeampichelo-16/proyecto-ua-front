<!-- src/components/SideBar.vue -->
<template>
  <aside class="w-64 bg-[#e1e1e1] text-black p-6 min-h-screen flex flex-col justify-between shadow-lg">
    <div>
      <div class="flex justify-center mb-8">
        <img src="https://mansercom.pe/wp-content/themes/mansercom/images/logotipo.svg" alt="Mansercom Logo"
          class="w-32 h-auto" />
      </div>

      <nav>
        <ul class="space-y-4">
          <li v-for="link in sidebarLinks" :key="link.to">
            <RouterLink :to="link.to"
              class="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#fdd21f] hover:scale-[1.02] transform"
              :class="{
                'bg-[#fdd21f] font-bold shadow-inner text-black': isActiveLink(link.to),
                'text-black': !isActiveLink(link.to)
              }">
              <component :is="link.icon" class="w-5 h-5" />
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <button @click="logout"
      class="mt-10 w-full py-3 bg-red-600 hover:bg-red-700 transition-colors duration-300 rounded-lg font-semibold tracking-wide shadow-md text-white">
      Cerrar sesión
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProfileStore } from "../stores/profileStore";
import { sidebarLinksByRole, type SidebarLink } from "../router/sidebarLinks";
import { useAuthStore } from "../stores/authStore";
import { AuthRoutes } from "../router/routeNames";

const profile = useProfileStore();
const route = useRoute();

const store = useAuthStore();
const router = useRouter();

function logout() {
  store.logout();
  router.push(AuthRoutes.LOGIN);
}

const sidebarLinks = computed<SidebarLink[]>(() => {
  if (!profile.role) return [];
  return sidebarLinksByRole[profile.role] || [];
});

function isActiveLink(path: string) {
  return route.path.startsWith(path);
}
</script>
