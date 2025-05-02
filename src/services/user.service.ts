// src/services/user.service.ts

import api from "../lib/axios";
import type { Client, PaginatedClientResponse } from "../types/client";
import type { Machine, MachineResponse } from "../types/platform";
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
