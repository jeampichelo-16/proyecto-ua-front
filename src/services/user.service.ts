// src/services/user.service.ts

import api from "../lib/axios";
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