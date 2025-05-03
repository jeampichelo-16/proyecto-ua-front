import api from "../lib/axios";
import { ErrorService } from "./error.service";
import type { Role } from "../types/user";
import type {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  ResetPasswordResponse,
} from "../types/auth";

export async function loginUser(email: string, password: string, role: Role) {
  try {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
      role,
    });
    return res.data.user;
  } catch (err) {
    const message = ErrorService.handle(err);
    throw new Error(message);
  }
}

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const res = await api.post<LogoutResponse>("/auth/logout");
    return res.data;
  } catch (err) {
    const message = ErrorService.handle(err);
    throw new Error(message);
  }
}

export async function refreshTokens(): Promise<RefreshTokenResponse> {
  try {
    const res = await api.post<RefreshTokenResponse>("/auth/refresh-token");
  
    return res.data;
  } catch (err) {
    const message = ErrorService.handle(err);
    throw new Error(message);
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> {
  try {
    const res = await api.post<ResetPasswordResponse>("/auth/reset-password", {
      token,
      newPassword,
    });

    return res.data;
  } catch (err) {
    const message = ErrorService.handle(err);
    throw new Error(message);
  }
}

export async function forgotPassword(
  email: string
): Promise<{ message: string }> {
  try {
    const res = await api.post<{ message: string }>("/auth/forgot-password", {
      email,
    });
    return res.data;
  } catch (err) {
    const message = ErrorService.handle(err);
    throw new Error(message);
  }
}
