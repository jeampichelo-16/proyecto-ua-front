// src/composables/useSessionFlags.ts
import { ref } from "vue";

const isInitializing = ref(true);

const SESSION_LOGOUT_KEY = "session_logged_out";
const SESSION_ACTIVE = "session_active";

export function useSessionFlags() {
  function markInitialized() {
    isInitializing.value = false;
  }

  function markSessionAsActive() {
    sessionStorage.setItem(SESSION_ACTIVE, "true");
  }

  function clearSessionActiveFlag() {
    sessionStorage.removeItem(SESSION_ACTIVE);
  }

  function isSessionInvalid(): boolean {
    return sessionStorage.getItem(SESSION_LOGOUT_KEY) === "true";
  }

  function markSessionAsLoggedOut() {
    sessionStorage.setItem(SESSION_LOGOUT_KEY, "true");
  }

  function clearSessionLogoutFlag() {
    sessionStorage.removeItem(SESSION_LOGOUT_KEY);
  }

  return {
    isInitializing,
    markInitialized,
    isSessionInvalid,
    markSessionAsLoggedOut,
    clearSessionLogoutFlag,
    markSessionAsActive,
    clearSessionActiveFlag,
  };
}
