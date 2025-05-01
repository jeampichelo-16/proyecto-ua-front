import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getProfile } from "../services/user.service";
import type { Role, UserResponseDto } from "../types/user";
import { useAuthStore } from "./authStore";
import { useSessionFlags } from "../composables/useSessionFlags";

export const useProfileStore = defineStore("profile", () => {
  const username = ref<string | null>(null);
  const role = ref<Role | null>(null);
  const { markSessionAsLoggedOut, markInitialized } = useSessionFlags();

  const user = computed(() =>
    username.value && role.value
      ? { username: username.value, role: role.value }
      : null
  );

  function setUser(profile: UserResponseDto) {
    username.value = profile.username;
    role.value = profile.role;
  }

  function clearUser() {
    username.value = null;
    role.value = null;
  }

  async function fetchUser() {
    const auth = useAuthStore();
    try {
      if (auth.wasLoggedOut) {
        markInitialized();
        return false;
      }

      const profile = await getProfile();
      setUser(profile);
      auth.isAuthenticated = true;
      return true;
    } catch {
      clearUser();
      auth.clearSession();
      markSessionAsLoggedOut(); // 🔥 Marca sesión cerrada si falló
      return false;
    } finally {
      auth.isInitialized = true;
      markInitialized();
    }
  }

  return {
    username,
    role,
    user,
    setUser,
    clearUser,
    fetchUser,
  };
});
