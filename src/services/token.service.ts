import { refreshTokens } from "./auth.service";
import router from "../router";
import { useAuthStore } from "../stores/authStore";
import { AuthRoutes } from "../router/routeNames";
import { notifyWarning } from "../utils/notify";

//1 MINUTO 
const TOKEN_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 10 minutos
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startTokenAutoRefresh() {
  if (refreshInterval) return;

  refreshInterval = setInterval(async () => {
    try {
      await refreshTokens();
    } catch (err) {
      useAuthStore().logout(); // solo logout, SIN toast aquí
      notifyWarning({
        title: "Sesión expirada",
        description: "Redirigiendo a la página de inicio de sesión...",
      });
      setTimeout(() => {
        navigateToLogin();
      }, 1500);
    }
  }, TOKEN_REFRESH_INTERVAL_MS);
}

export function stopTokenAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

export function navigateToLogin() {
  router.push(AuthRoutes.LOGIN); // ✅ Ya no está hardcodeado "/"
}
