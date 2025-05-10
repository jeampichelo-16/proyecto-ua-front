export interface QuotationRatePoint {
    date: string
    rate: number
    total: number
    processed: number
  }
  
  export interface ResponseTimePoint {
    date: string
    responseHours: number
  }
  
  export interface AdminDashboardData {
    totalClients: number
    totalQuotations: number
    activeOperators: number
    quotationRateAvg: number
    avgResponseTimeInHours: number
    quotationConversionRate: number
    quotationRateSeries: QuotationRatePoint[]
    responseTimeSeries: ResponseTimePoint[]
  }
  