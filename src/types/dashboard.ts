export interface LabeledValue {
  value: number
  description: string
}

export interface TimeSeriesPoint {
  label: string
  value: number
}

export interface StatusCountItem {
  status: string
  count: number
}

export interface StatusDistribution {
  description: string
  data: StatusCountItem[]
}

export interface AdminDashboardData {
  averageProcessedRate: LabeledValue
  averageResponseTime: LabeledValue
  processedRateSeriesDescription: string
  processedRateSeries: TimeSeriesPoint[]
  responseTimeSeriesDescription: string
  responseTimeSeries: TimeSeriesPoint[]
  totalPaidAmount: LabeledValue
  platformStatusDistribution: StatusDistribution
  operatorStatusDistribution: StatusDistribution
  quotationStatusDistribution: StatusDistribution
}
