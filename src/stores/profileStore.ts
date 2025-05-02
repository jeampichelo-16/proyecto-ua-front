import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getProfile } from "../services/user.service";
import type { Role, UserResponseDto } from "../types/user";
import { useAuthStore } from "./authStore";
import { useSessionFlags } from "../composables/useSessionFlags";

export const useProfileStore = defineStore("profile", () => {
  const username = ref<string | null>(null);
  const email = ref<string | null>(null);
  const firstName = ref<string | null>(null);
  const lastName = ref<string | null>(null);
  const role = ref<Role | null>(null);
  const isActive = ref<boolean>(false);
  const isEmailVerified = ref<boolean>(false);
  const lastLoginAt = ref<string | null>(null);

  const { markSessionAsLoggedOut, markInitialized } = useSessionFlags();

  const user = computed(() =>
    username.value && role.value
      ? {
          username: username.value,
          role: role.value,
          email: email.value,
          firstName: firstName.value,
          lastName: lastName.value,
          isActive: isActive.value,
          isEmailVerified: isEmailVerified.value,
          lastLoginAt: lastLoginAt.value,
        }
      : null
  );

  function setUser(profile: UserResponseDto) {
    username.value = profile.username;
    role.value = profile.role;
    email.value = profile.email;
    firstName.value = profile.firstName;
    lastName.value = profile.lastName;
    isActive.value = profile.isActive;
    isEmailVerified.value = profile.isEmailVerified;
    lastLoginAt.value = profile.lastLoginAt;
  }

  function clearUser() {
    username.value = null;
    email.value = null;
    firstName.value = null;
    lastName.value = null;
    role.value = null;
    isActive.value = false;
    isEmailVerified.value = false;
    lastLoginAt.value = null;
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
    email,
    firstName,
    lastName,
    role,
    isActive,
    isEmailVerified,
    lastLoginAt,
    user,
    setUser,
    clearUser,
    fetchUser,
  };
});
