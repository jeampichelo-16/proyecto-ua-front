/**
 * Devuelve la clase de color correspondiente al estado de la cotización.
 */

import { QuotationStatus } from "../types/quotation";

export function getQuotationStatusBadgeClass(status: QuotationStatus): string {
  switch (status) {
    case QuotationStatus.PENDIENTE_DATOS:
      return "bg-yellow-100 text-yellow-800";
    case QuotationStatus.PENDIENTE_PAGO:
      return "bg-blue-100 text-blue-700";
    case QuotationStatus.PAGADO:
      return "bg-green-100 text-green-700";
    case QuotationStatus.RECHAZADO:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

/**
 * Devuelve el label amigable para mostrar del estado de la cotización.
 */

export function getQuotationStatusLabel(status: QuotationStatus): string {
  switch (status) {
    case QuotationStatus.PENDIENTE_DATOS:
      return "Pendiente de datos";
    case QuotationStatus.PENDIENTE_PAGO:
      return "Pendiente de pago";
    case QuotationStatus.PAGADO:
      return "Pagado";
    case QuotationStatus.RECHAZADO:
      return "Rechazado";
    default:
      return "Desconocido";
  }
}
