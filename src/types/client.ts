export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  ruc: string;
  companyName: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone: string;
  ruc: string;
  companyName: string;
  address: string;
}

export interface PaginatedClientResponse {
  clients: Client[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateClientDto {
  name: string
  phone: string
  email: string
  companyName: string
  address: string
  isActive: boolean
}

