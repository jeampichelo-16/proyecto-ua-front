export interface Machine {
  serial: string;
  brand: string;
  model: string;
  typePlatform: string;
  price: number;
  status: string;
  description: string;
  operativityCertificatePath: string;
  ownershipDocumentPath: string;
}

export interface MachineResponse {
  machines: Machine[];
  total: number;
  page: number;
  pageSize: number;
}
