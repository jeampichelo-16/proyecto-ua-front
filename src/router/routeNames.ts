// src/router/routeNames.ts

// 📂 Rutas de autenticación
export const AuthRoutes = {
  LOGIN: "/",
  FORGOT_PASSWORD: "/auth/olvide-contrasena",
  RESET_PASSWORD: "/auth/restablecer-contrasena",
} as const;

// 📂 Rutas del panel de administración
export const AdminRoutes = {
  DASHBOARD: "/admin/dashboard", // CRUD de clientes
  MANAGE_PLATFORMS: "/admin/gestionar-plataformas", // CRUD de plataformas (maquinarias)
  MANAGE_EMPLOYEES: "/admin/gestionar-empleados", // CRUD de usuarios
  MANAGE_OPERATORS: "/admin/gestionar-operarios", // CRUD de operarios
} as const;

// 📂 Rutas de usuarios (comunes a ambos)
export const UserRoutes = {
  PROFILE: "/usuario/perfil",
  MANAGE_CLIENTS: "/usuario/gestionar-clientes",
  QUOTATIONS: "/usuario/cotizaciones", // Cotizaciones
} as const;

// 📂 Rutas del panel de empleados
export const EmployeeRoutes = {
  REPORTS: "/empleado/reportes", // CRUD de clientes
} as const;

// 📂 Rutas de error
export const ErrorRoutes = {
  FORBIDDEN: "/auth/ruta-prohibida",
  NOT_FOUND: "/auth/ruta-no-encontrada",
} as const;

// 📦 Agrupación total
export const RouteNames = {
  ...AuthRoutes,
  ...AdminRoutes,
  ...EmployeeRoutes,
  ...UserRoutes,
  ...ErrorRoutes,
} as const;

// 📋 Tipado
export type RouteName = typeof RouteNames[keyof typeof RouteNames];
