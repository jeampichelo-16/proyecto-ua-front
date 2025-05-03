// types/quotationCreate.ts

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
  
  export interface CreateQuotationPayload {
    clientId: number
    platformId: number
    description: string
    days: number
    isNeedOperator: boolean
  }
  