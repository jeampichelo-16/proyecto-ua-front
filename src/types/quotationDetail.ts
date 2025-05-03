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
  