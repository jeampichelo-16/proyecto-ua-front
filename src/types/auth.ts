// src/types/auth.ts

export interface LoginResponse {
    user: {
      id: number;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      role: string;
      isActive: boolean;
      isEmailVerified: boolean;
      createdAt: string;
      lastLoginAt: string | null;
    };
    message: string;
    statusCode: number;
    success: boolean;
  }
  
  export interface LogoutResponse {
    message: string;
    statusCode: number;
    success: boolean;
  }
  
  export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
  }

  export interface ResetPasswordResponse {
    message: string;
    statusCode: number;
    success: boolean;
  }