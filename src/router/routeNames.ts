// src/router/routeNames.ts

// 📂 Rutas de autenticación
export const AuthRoutes = {
  LOGIN: "/",
  FORGOT_PASSWORD: "/auth/olvide-contrasena",
  RESET_PASSWORD: "/auth/restablecer-contrasena",
} as const;

// 📂 Rutas del panel de administración
export const AdminRoutes = {
  DASHBOARD: "/admin/dashboard",
  MANAGE_CLIENTS: "/admin/gestionar-clientes",        // CRUD de clientes
  MANAGE_PRODUCTS: "/admin/gestionar-productos",      // CRUD de plataformas (maquinarias)
  MANAGE_USERS: "/admin/gestionar-usuarios",           // CRUD de usuarios
  QUOTATIONS: "/admin/cotizaciones",                  // Cotizaciones
  REQUESTS: "/admin/solicitudes",                      // Solicitudes
} as const;

// 📂 Rutas de usuarios (comunes a ambos)
export const UserRoutes = {
  PROFILE: "/usuario/perfil",
} as const;

// 📂 Rutas del panel de empleados
export const EmployeeRoutes = {
  REPORTS: "/empleado/reportes",                      // Generar reportes
  MANAGE_CLIENTS: "/empleado/gestionar-clientes",      // CRUD de clientes
  QUOTATIONS: "/empleado/cotizaciones",                // Hacer cotización
  REQUESTS: "/empleado/solicitudes",                   // Registrar solicitud
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
