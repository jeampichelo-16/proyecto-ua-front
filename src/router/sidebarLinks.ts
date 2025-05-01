// src/router/sidebarLinks.ts

import { AdminRoutes, UserRoutes, EmployeeRoutes } from "./routeNames";
import type { Role } from "../types/user"; // Asumiendo que tu Role está en types/user.ts
import {
  Home,
  Users,
  Box,
  UserCog,
  FileText,
  ClipboardList,
  User,
  type LucideIcon,
} from "lucide-vue-next";

export interface SidebarLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

// 📂 Links para Administrador
export const adminSidebarLinks: SidebarLink[] = [
  { label: "Dashboard", to: AdminRoutes.DASHBOARD, icon: Home },
  { label: "Gestionar Clientes", to: AdminRoutes.MANAGE_CLIENTS, icon: Users },
  { label: "Gestionar Productos", to: AdminRoutes.MANAGE_PRODUCTS, icon: Box },
  { label: "Gestionar Usuarios", to: AdminRoutes.MANAGE_USERS, icon: UserCog },
  { label: "Cotizaciones", to: AdminRoutes.QUOTATIONS, icon: FileText },
  { label: "Solicitudes", to: AdminRoutes.REQUESTS, icon: ClipboardList },
  { label: "Perfil", to: UserRoutes.PROFILE, icon: User },
];

export const employeeSidebarLinks: SidebarLink[] = [
  {
    label: "Gestionar Clientes",
    to: EmployeeRoutes.MANAGE_CLIENTS,
    icon: Users,
  },
  { label: "Cotizaciones", to: EmployeeRoutes.QUOTATIONS, icon: FileText },
  { label: "Solicitudes", to: EmployeeRoutes.REQUESTS, icon: ClipboardList },
  { label: "Reportes", to: EmployeeRoutes.REPORTS, icon: Box },
  { label: "Perfil", to: UserRoutes.PROFILE, icon: User },
];

export const sidebarLinksByRole: Record<Role, SidebarLink[]> = {
  ADMIN: adminSidebarLinks,
  EMPLEADO: employeeSidebarLinks,
  OPERARIO: [],
};
