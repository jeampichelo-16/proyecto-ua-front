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
