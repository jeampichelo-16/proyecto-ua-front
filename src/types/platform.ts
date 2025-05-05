export enum MachineStatus {
  ACTIVO = "ACTIVO",
  EN_TRABAJO = "EN_TRABAJO",
  EN_COTIZACION = "EN_COTIZACION",
  EN_MANTENIMIENTO = "EN_MANTENIMIENTO",
  INACTIVO = "INACTIVO",
}

export enum PlatformType {
  ELECTRICO = "ELECTRICO",
  DIESEL = "DIESEL",
  OTRO = "OTRO",
}

export interface Machine {
  serial: string;
  brand: string;
  model: string;
  typePlatform: PlatformType;
  price: number;
  status: MachineStatus;
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

export interface UpdatePlatformDto {
  brand: string
  model: string
  typePlatform: string
  price: number
  status: MachineStatus
  description: string
  operativityCertificatePath: File | null
  ownershipDocumentPath: File | null
}