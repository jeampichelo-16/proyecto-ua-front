// utils/machineStatusUtils.ts
import { MachineStatus } from "../types/platform";

export function getMachineStatusLabel(status: MachineStatus): string {
  switch (status) {
    case MachineStatus.ACTIVO:
      return "Activo";
    case MachineStatus.EN_TRABAJO:
      return "En trabajo";
    case MachineStatus.EN_COTIZACION:
      return "En cotización";
    case MachineStatus.EN_MANTENIMIENTO:
      return "En mantenimiento";
    case MachineStatus.INACTIVO:
      return "Inactivo";
    default:
      return "Desconocido";
  }
}

export function getMachineStatusBadgeClass(status: MachineStatus): string {
  switch (status) {
    case MachineStatus.ACTIVO:
      return "bg-green-100 text-green-700";
    case MachineStatus.EN_TRABAJO:
      return "bg-blue-100 text-blue-700";
    case MachineStatus.EN_COTIZACION:
      return "bg-yellow-100 text-yellow-800";
    case MachineStatus.EN_MANTENIMIENTO:
      return "bg-orange-100 text-orange-800";
    case MachineStatus.INACTIVO:
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-200 text-gray-500";
  }
}
