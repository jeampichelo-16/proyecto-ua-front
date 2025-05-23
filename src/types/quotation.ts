export interface Quotation {
  id: number;
  status: QuotationStatus;
  createdAt: string;
  startDate: string;
  endDate: string;
  codeQuotation: string;
}

export interface ApproveQuotationPayload {
  quotationId: number;
  deliveryAmount: number;
  operatorId?: number | null;
}

export interface CreateQuotationPayload {
  clientId: number;
  platformId: number;
  description: string;
  startDate: string; // ISO format (e.g. '2025-05-15T00:00:00.000Z')
  endDate: string; // ISO format
  isNeedOperator: boolean;
}

export interface ActiveClient {
  id: number;
  companyName: string;
  ruc: string;
}

export interface ActivePlatform {
  id: number;
  serial: string;
  brand: string;
  model: string;
  typePlatform: string;
  price: number;
}

export enum QuotationStatus {
  PENDIENTE_DATOS = "PENDIENTE_DATOS",
  PENDIENTE_PAGO = "PENDIENTE_PAGO",
  PAGADO = "PAGADO",
  RECHAZADO = "RECHAZADO",
}

export interface QuotationDetail {
  id: number;
  description: string;
  amount: number;
  deliveryAmount: number;
  subtotal: number;
  igv: number;

  total: number;
  typeCurrency: string;
  isNeedOperator: boolean;
  status: QuotationStatus;
  quotationPath: string;
  paymentReceiptPath: string;
  createdAt: string;
  statusToPendingPagoAt: string;
  statusToPagadoAt: string;
  statusToRechazadoAt: string;
  endDate: string;
  startDate: string;
  client: {
    id: number;
    name: string;
    email: string;
  };
  platform: {
    id: number;
    serial: string;
    brand: string;
    model: string;
  };
  operator: null | {
    id: number;
    fullName: string;
  };
}
