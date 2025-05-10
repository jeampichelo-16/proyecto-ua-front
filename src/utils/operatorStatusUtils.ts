import { OperatorStatus } from "../types/operator";

/**
 * Devuelve la clase de color correspondiente al estado del operador.
 */
export function getOperatorStatusBadgeClass(status: OperatorStatus): string {
  switch (status) {
    case OperatorStatus.ACTIVO:
      return "bg-green-100 text-green-700";
    case OperatorStatus.EN_TRABAJO:
      return "bg-blue-100 text-blue-700";
    case OperatorStatus.EN_COTIZACION:
      return "bg-yellow-100 text-yellow-800";
    case OperatorStatus.INACTIVO:
      return "bg-red-100 text-red-700";
    case OperatorStatus.NO_DISPONIBLE:
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

/**
 * Devuelve el label amigable para mostrar del estado del operador.
 */
export function getOperatorStatusLabel(status: OperatorStatus): string {
  switch (status) {
    case OperatorStatus.ACTIVO:
      return "Activo";
    case OperatorStatus.EN_TRABAJO:
      return "En trabajo";
    case OperatorStatus.INACTIVO:
      return "Inactivo";
    case OperatorStatus.NO_DISPONIBLE:
      return "No disponible";
    case OperatorStatus.EN_COTIZACION:
      return "En cotización";
    default:
      return "Desconocido";
  }
}
