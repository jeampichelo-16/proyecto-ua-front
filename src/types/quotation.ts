export interface Quotation {
  id: number;
  clientName: string;
  platformSerial: string;
  days: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface ApproveQuotationPayload {
  quotationId: number;
  deliveryAmount: number;
  operatorId?: number | null;
}

export interface CreateQuotationPayload {
  clientId: number
  platformId: number
  description: string
  days: number
  isNeedOperator: boolean
}

export interface ActiveClient {
  id: number
  companyName: string
  ruc: string
}

export interface ActivePlatform {
  id: number
  serial: string
  brand: string
  model: string
  typePlatform: string
  price: number
}

export interface QuotationDetail {
  id: number
  description: string
  amount: number
  deliveryAmount: number
  subtotal: number
  igv: number
  total: number
  typeCurrency: string
  isNeedOperator: boolean
  status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
  days: number
  quotationPath: string
  createdAt: string
  updatedAt: string
  client: {
    id: number
    name: string
    email: string
  }
  platform: {
    id: number
    serial: string
    brand: string
    model: string
  }
  operator: null | {
    id: number
    fullName: string
  }
}
