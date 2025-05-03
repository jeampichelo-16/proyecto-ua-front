// src/services/user.service.ts

import api from "../lib/axios";
import type { Client, PaginatedClientResponse } from "../types/client";
import type {
  ActiveOperator,
  GetActiveOperatorsResponse,
} from "../types/operator";
import type { Machine, MachineResponse } from "../types/platform";
import type { Quotation } from "../types/quotation";
import type { ApproveQuotationPayload } from "../types/quotationApproval";
import type {
  ActiveClient,
  ActivePlatform,
  CreateQuotationPayload,
} from "../types/quotationCreate";
import type { QuotationDetail } from "../types/quotationDetail";
import type { UserResponseDto } from "../types/user";
import { ErrorService } from "./error.service";

export async function getProfile(): Promise<UserResponseDto> {
  try {
    const response = await api.get<UserResponseDto>("/users/profile");
    return response.data;
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getPaginatedClients(
  page: number
): Promise<PaginatedClientResponse> {
  try {
    const res = await api.get("/users/clients", {
      params: { page },
    });
    return res.data.data; // 👈 accedemos a "data" directamente
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getPaginatedMachines(
  page: number
): Promise<MachineResponse> {
  try {
    const res = await api.get("/admin/machines", {
      params: { page },
    });

    return res.data.data;
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getClientById(id: number): Promise<Client> {
  try {
    const res = await api.get<{ data: Client }>(`/users/clients/${id}`);
    return res.data.data;
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getMachineBySerial(serial: string): Promise<Machine> {
  try {
    const res = await api.get(`/admin/machines/${serial}`);
    return res.data.data;
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getPaginatedQuotations(page: number): Promise<{
  quotations: Quotation[];
  total: number;
  page: number;
  pageSize: number;
}> {
  try {
    const params = status ? { page, status } : { page };

    const res = await api.get("/users/quotations", { params });
    return res.data.data;
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getQuotationById(id: number): Promise<QuotationDetail> {
  try {
    const res = await api.get(`/users/quotations/${id}`);
    return res.data.data;
  } catch (err) {
    const message = ErrorService.handle(err);
    throw new Error(message);
  }
}

export async function getAvailableOperators(): Promise<
  { id: number; fullName: string }[]
> {
  try {
    const res = await api.get<GetActiveOperatorsResponse>(
      "/admin/active-operators"
    );
    return res.data.data.map((op: ActiveOperator) => ({
      id: op.id,
      fullName: `${op.firstName} ${op.lastName} - ${op.dni}`,
    }));
  } catch (err) {
    const message = ErrorService.handle(err);
    throw new Error(message);
  }
}

export async function approveQuotation(
  payload: ApproveQuotationPayload
): Promise<void> {
  try {
    await api.patch(`/users/quotations/${payload.quotationId}/activate`, {
      deliveryAmount: payload.deliveryAmount,
      ...(payload.operatorId ? { operatorId: payload.operatorId } : {}),
    });
  } catch (err) {
    const message = ErrorService.handle(err);
    throw new Error(message);
  }
}

export async function getActiveClients(): Promise<ActiveClient[]> {
  try {
    const res = await api.get("/users/active-clients");
    return res.data.data;
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function getActivePlatforms(): Promise<ActivePlatform[]> {
  try {
    const res = await api.get("/admin/active-machines");
    return res.data.data;
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function createQuotation(
  payload: CreateQuotationPayload
): Promise<void> {
  try {
    await api.post("/users/quotations", payload);
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}

export async function cancelQuotation(quotationId: number): Promise<void> {
  try {
    await api.patch(`/users/quotations/${quotationId}/cancel`);
  } catch (error) {
    const message = ErrorService.handle(error);
    throw new Error(message);
  }
}
