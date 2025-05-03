export interface Operator {
  id: number;
  idOperator: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dni: string;
  role: "OPERARIO" | string;
  emoPDFPath: string;
  operativityCertificatePath: string;
  phone: string;
  isActive: boolean;
}

export interface ActiveOperator {
  id: number
  userId: number
  firstName: string
  lastName: string
  dni: string
}

export interface GetActiveOperatorsResponse {
  message: string
  statusCode: number
  success: boolean
  data: ActiveOperator[]
}
