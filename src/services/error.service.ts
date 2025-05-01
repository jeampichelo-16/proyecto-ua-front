// src/services/error.service.ts

import axios from 'axios'

export class ErrorService {
  static handle(error: unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const data = error.response.data as { message?: string }
        return data.message || 'Error desconocido del servidor'
      } else if (error.request) {
        return 'Sin respuesta del servidor'
      } else {
        return 'Error al configurar la solicitud'
      }
    } else if (error instanceof Error) {
      return error.message
    } else {
      return 'Ocurrió un error inesperado'
    }
  }
}
