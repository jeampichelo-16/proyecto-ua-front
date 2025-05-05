export interface Employee {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  role: "EMPLEADO" | string;
  isActive: boolean;
}

export interface CreateEmployeeDTO {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  dni: string;
  phone: string;
}

export interface UpdateEmployeeDto {
  firstName: string;
  lastName: string;
  username: string;
  dni: string;
  phone: string;
  isActive: boolean;
}
