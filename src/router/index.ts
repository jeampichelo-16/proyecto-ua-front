import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useProfileStore } from "../stores/profileStore";
import BaseLayout from "../layouts/BaseLayout.vue";
import { Role } from "../types/user";

import {
  AuthRoutes,
  EmployeeRoutes,
  AdminRoutes,
  ErrorRoutes,
  UserRoutes,
} from "./routeNames";
import { useSessionFlags } from "../composables/useSessionFlags";
import { getActivePinia } from "pinia";
import { startTokenAutoRefresh } from "../services/token.service";

const routes = [
  // 📂 Auth
  {
    path: AuthRoutes.LOGIN,
    component: () => import("../views/auth/LoginView.vue"),
  },
  {
    path: AuthRoutes.FORGOT_PASSWORD,
    component: () => import("../views/auth/ForgotPasswordView.vue"),
    meta: { guestOnly: true },
  },
  {
    path: AuthRoutes.RESET_PASSWORD,
    component: () => import("../views/auth/ResetPasswordView.vue"),
  },

  // 📂 Perfil (Common para Admin y Empleado)
  {
    path: UserRoutes.PROFILE,
    component: BaseLayout,
    meta: { requiresAuth: true, role: [Role.ADMIN, Role.EMPLEADO] },
    children: [
      {
        path: "",
        component: () => import("../views/user/UserProfileView.vue"),
      },
    ],
  },
  {
    path: UserRoutes.MANAGE_CLIENTS,
    component: BaseLayout,
    meta: { requiresAuth: true, role: [Role.ADMIN, Role.EMPLEADO] },
    children: [
      {
        path: "",
        component: () => import("../views/user/ManageClientsView.vue"),
      },
    ],
  },
  //cotizacioes
  {
    path: UserRoutes.QUOTATIONS,
    component: BaseLayout,
    meta: { requiresAuth: true, role: [Role.ADMIN, Role.EMPLEADO] },
    children: [
      {
        path: "",
        component: () => import("../views/user/QuotationsView.vue"),
      },
    ],
  },

  // 📂 Panel Admin (Dashboard principal)
  //Gestionar plataformas
  {
    path: AdminRoutes.MANAGE_PLATFORMS,
    component: BaseLayout,
    meta: { requiresAuth: true, role: [Role.ADMIN] },
    children: [
      {
        path: "",
        component: () => import("../views/user/ManagePlatformsView.vue"),
      },
    ],
  },

  // 📂 Panel Admin (Dashboard principal)
  {
    path: AdminRoutes.DASHBOARD,
    component: BaseLayout,
    meta: { requiresAuth: true, role: [Role.ADMIN] },
    children: [
      {
        path: "",
        component: () => import("../views/admin/AdminDashboardView.vue"),
      },
    ],
  },
  //GESTIONAR USUARIIS
  {
    path: AdminRoutes.MANAGE_USERS,
    component: BaseLayout,
    meta: { requiresAuth: true, role: [Role.ADMIN] },
    children: [
      {
        path: "",
        component: () => import("../views/admin/ManageUsersView.vue"),
      },
    ],
  },
  {
    path: AdminRoutes.MANAGE_OPERATORS,
    component: BaseLayout,
    meta: { requiresAuth: true, role: [Role.ADMIN] },
    children: [
      {
        path: "",
        component: () => import("../views/admin/ManageOperatorsView.vue"),
      },
    ],
  },

  // 📂 Empleado - Reportes
  {
    path: EmployeeRoutes.REPORTS,
    component: BaseLayout,
    meta: { requiresAuth: true, role: [Role.ADMIN, Role.EMPLEADO] },
    children: [
      {
        path: "",
        component: () => import("../views/reports/GenerateReportView.vue"),
      },
    ],
  },

  // 📂 Catch Admin no encontrado
  {
    path: "/admin/:pathMatch(.*)*",
    redirect: ErrorRoutes.NOT_FOUND,
  },
  // 📂 Catch Empleado no encontrado
  {
    path: "/empleado/:pathMatch(.*)*",
    redirect: ErrorRoutes.NOT_FOUND,
  },
  // 📂 Catch Global (cualquier otra cosa)
  {
    path: "/:pathMatch(.*)*",
    redirect: ErrorRoutes.NOT_FOUND,
  },
  // 📂 Error pages
  {
    path: ErrorRoutes.FORBIDDEN,
    component: () => import("../views/error/ForbiddenView.vue"),
  },
  {
    path: ErrorRoutes.NOT_FOUND,
    component: () => import("../views/error/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function safeUseAuthStore() {
  if (!getActivePinia()) return null;
  return useAuthStore();
}

function safeUseProfileStore() {
  if (!getActivePinia()) return null;
  return useProfileStore();
}

router.beforeEach(async (to, _from, next) => {
  const auth = safeUseAuthStore();
  const profile = safeUseProfileStore();
  const { markInitialized, isSessionInvalid } = useSessionFlags();

  if (!auth || !profile) {
    return next(ErrorRoutes.FORBIDDEN);
  }

  if (!auth.isInitialized) {
    if (isSessionInvalid()) {
      auth.isInitialized = true;
      markInitialized();
    } else {
      startTokenAutoRefresh();
      await profile.fetchUser();
    }
  }

  // 🚨 Aquí validamos el token en /auth/restablecer-contrasena
  if (to.path === AuthRoutes.RESET_PASSWORD && !to.query.token) {
    return next(ErrorRoutes.NOT_FOUND);
  }

  // El resto de tu lógica...
  const isLoginRoute = to.path === AuthRoutes.LOGIN;

  if (isLoginRoute && auth.isAuthenticated) {
    if (profile.role === Role.ADMIN) return next(AdminRoutes.DASHBOARD);
    if (profile.role === Role.EMPLEADO) return next(EmployeeRoutes.REPORTS);
    return next(ErrorRoutes.FORBIDDEN);
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    if (profile.role === Role.ADMIN) return next(AdminRoutes.DASHBOARD);
    if (profile.role === Role.EMPLEADO) return next(EmployeeRoutes.REPORTS);
    return next(ErrorRoutes.FORBIDDEN);
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next(AuthRoutes.LOGIN);
  }

  const allowedRoles: Role[] = (to.meta?.role as Role[]) ?? [];
  const isPublicRoute = !to.meta?.requiresAuth;

  if (
    !isPublicRoute &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(profile.role!)
  ) {
    return next(ErrorRoutes.FORBIDDEN);
  }

  next();
});

export default router;
