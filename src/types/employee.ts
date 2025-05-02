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
