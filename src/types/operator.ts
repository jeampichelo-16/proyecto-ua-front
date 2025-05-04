export enum OperatorStatus {
  ACTIVO = "ACTIVO",
  EN_TRABAJO = "EN_TRABAJO",
  INACTIVO = "INACTIVO",
  NO_DISPONIBLE = "NO_DISPONIBLE",
}

export interface Operator {
  idOperator: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dni: string;
  operatorStatus: OperatorStatus;
  role: "OPERARIO" | string;
  emoPDFPath: string;
  operativityCertificatePath: string;
  phone: string;
  isActive: boolean;
}

export interface ActiveOperator {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dni: string;
}

export interface GetActiveOperatorsResponse {
  message: string;
  statusCode: number;
  success: boolean;
  data: ActiveOperator[];
}
