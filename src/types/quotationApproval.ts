export interface ApproveQuotationPayload {
  quotationId: number;
  deliveryAmount: number;
  operatorId?: number | null;
}
