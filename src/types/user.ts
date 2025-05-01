export enum Role {
    ADMIN = 'ADMIN',
    EMPLEADO = 'EMPLEADO',
    OPERARIO = 'OPERARIO',
  }
  
  export interface UserResponseDto {
    id: number
    email: string
    username: string
    firstName: string
    lastName: string
    role: Role
    isActive: boolean
    isEmailVerified: boolean
    createdAt: string // o Date si lo conviertes
    lastLoginAt: string | null // o Date | null
  }
  