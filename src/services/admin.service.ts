import api from "../lib/axios";
import type { Employee } from "../types/employee";
import type { Operator } from "../types/operator";
import { ErrorService } from "./error.service";

export async function getPaginatedEmployees(page: number): Promise<{
  users: Employee[];
  total: number;
  page: number;
  pageSize: number;
}> {
  try {
    const res = await api.get("/admin/employees", {
      params: { page },
    });

    return res.data.data; // ← contiene { users, total, page, pageSize }
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getEmployeeById(id: number): Promise<Employee> {
  try {
    const res = await api.get<{ data: Employee }>(`/admin/employees/${id}`);
    return res.data.data;
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getPaginatedOperators(page: number): Promise<{
  users: Operator[];
  total: number;
  page: number;
  pageSize: number;
}> {
  try {
    const res = await api.get("/admin/operators", {
      params: { page },
    });

    return res.data.data; // ✔️ users, total, page, pageSize
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getOperatorById(idOperator: number): Promise<Operator> {
  try {
    const res = await api.get<{ data: Operator }>(
      `/admin/operators/${idOperator}`
    );

    return res.data.data; // si tu backend sigue respondiendo con `users: []`
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function deleteOperatorById(id: number) {
  try {
    const res = await api.delete(`/admin/operators/${id}`);
    return res.data.data; // si tu backend sigue respondiendo con `users: []`
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function createOperator(formData: FormData) {
  try {
    const res = await api.post("/admin/operators", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data; // si tu backend sigue respondiendo con `users: []`
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function updateOperatorById(
  id: number,
  data: FormData
): Promise<void> {
  try {
    await api.patch(`/admin/operators/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}
