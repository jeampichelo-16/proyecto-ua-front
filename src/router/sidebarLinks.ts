// src/router/sidebarLinks.ts

import { AdminRoutes, UserRoutes } from "./routeNames";
import type { Role } from "../types/user"; // Asumiendo que tu Role está en types/user.ts
import {
  Home,
  Users,
  Box,
  UserCog,
  FileText,
  User,
} from "lucide-vue-next"; // Asegúrate de tener lucide-vue-next instalado
import type { LucideIcon } from "lucide-vue-next"; // Asegúrate de tener lucide-vue-next instalado

export interface SidebarLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

// 📂 Links para Administrador
export const adminSidebarLinks: SidebarLink[] = [
  { label: "Dashboard", to: AdminRoutes.DASHBOARD, icon: Home },
  { label: "Gestionar Clientes", to: UserRoutes.MANAGE_CLIENTS, icon: Users },
  {
    label: "Gestionar Plataformas",
    to: AdminRoutes.MANAGE_PLATFORMS,
    icon: Box,
  },
  { label: "Gestionar Empleados", to: AdminRoutes.MANAGE_EMPLOYEES, icon: UserCog },
  { label: "Gestionar Operarios", to: AdminRoutes.MANAGE_OPERATORS, icon: UserCog },
  { label: "Cotizaciones", to: UserRoutes.QUOTATIONS, icon: FileText },
  { label: "Perfil", to: UserRoutes.PROFILE, icon: User },
];

export const employeeSidebarLinks: SidebarLink[] = [
  {
    label: "Gestionar Clientes",
    to: UserRoutes.MANAGE_CLIENTS,
    icon: Users,
  },
  { label: "Cotizaciones", to: UserRoutes.QUOTATIONS, icon: FileText },
  { label: "Perfil", to: UserRoutes.PROFILE, icon: User },
];

export const sidebarLinksByRole: Record<Role, SidebarLink[]> = {
  ADMIN: adminSidebarLinks,
  EMPLEADO: employeeSidebarLinks,
  OPERARIO: [],
};
