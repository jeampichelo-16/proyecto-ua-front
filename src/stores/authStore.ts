import { defineStore } from "pinia";
import { ref } from "vue";
import { loginUser, logoutUser } from "../services/auth.service";
import {
  startTokenAutoRefresh,
  stopTokenAutoRefresh,
} from "../services/token.service";
import { notifySuccess, notifyError, notifyInfo } from "../utils/notify";
import { ToastMessages } from "../constants/toastMessages";
import type { Role } from "../types/user";
import { useProfileStore } from "./profileStore";
import { useSessionFlags } from "../composables/useSessionFlags";

const logoutFlagKey = "session_logged_out";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const wasLoggedOut = ref(false);
  const isInitialized = ref(false);
  const { clearSessionLogoutFlag } = useSessionFlags();

  async function login(
    email: string,
    password: string,
    role: Role
  ): Promise<boolean> {
    loading.value = true;
    try {
      const user = await loginUser(email, password, role);
      const profileStore = useProfileStore();
      profileStore.setUser({
        ...user,
        role: user.role as Role,
      });

      isAuthenticated.value = true;
      clearSessionLogoutFlag(); // 🧹 Limpia el logout flag
      wasLoggedOut.value = false;
      startTokenAutoRefresh();

      notifySuccess({
        title: ToastMessages.login.success.title,
        description: ToastMessages.login.success.description,
      });

      return true;
    } catch (err) {
      clearSession();
      notifyError({
        title: ToastMessages.login.error.title,
        description: ToastMessages.login.error.description,
      });
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    logoutUser();
    stopTokenAutoRefresh();
    clearSession();
    sessionStorage.setItem(logoutFlagKey, "true");
    wasLoggedOut.value = true;
    notifyInfo({
      title: ToastMessages.logout.title,
      description: ToastMessages.logout.description,
    });
  }

  function clearSession() {
    isAuthenticated.value = false;
    isInitialized.value = true; // 🔥 Aunque sea en error, terminamos inicialización
    useProfileStore().clearUser();
  }

  return {
    isAuthenticated,
    loading,
    wasLoggedOut,
    isInitialized,
    login,
    logout,
    clearSession,
  };
});
