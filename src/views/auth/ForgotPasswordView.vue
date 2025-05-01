<template>
  <div class="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8">
      <div class="text-center">
        <img src="https://mansercom.pe/wp-content/themes/mansercom/images/logotipo.svg" alt="Logo"
          class="w-24 mx-auto mb-6" />
        <h2 class="text-3xl font-extrabold text-gray-800">¿Olvidaste tu contraseña?</h2>
        <p class="text-sm text-gray-600 mt-2">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
          <input v-model="email" type="email" required placeholder="ejemplo@correo.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd21f]"
            :class="{ 'border-red-500': emailTouched && !isEmailValid }" @blur="emailTouched = true" />
          <p v-if="emailTouched && !isEmailValid" class="text-xs text-red-600 mt-1">
            Ingresa un correo válido.
          </p>
        </div>

        <button type="submit" :disabled="loading || !isEmailValid"
          class="w-full py-3 font-bold text-black bg-[#fdd21f] rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
          {{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
        </button>
      </form>

      <div class="text-center">
        <RouterLink :to="AuthRoutes.LOGIN" class="text-sm font-semibold text-[#fdd21f] hover:underline">
          Volver al inicio de sesión
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AuthRoutes } from '../../router/routeNames'
import { forgotPassword } from '../../services/auth.service'
import { notifyError, notifySuccess } from '../../utils/notify'

const email = ref('')
const emailTouched = ref(false)
const loading = ref(false)

const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
)

const handleSubmit = async () => {
  loading.value = true
  try {
    await forgotPassword(email.value.trim())
    notifySuccess({
      title: 'Correo enviado',
      description: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
    })
    email.value = ''
    emailTouched.value = false
  } catch (err) {
    notifyError({
      title: 'Error',
      description: 'No se pudo enviar el correo de recuperación. Intenta nuevamente.',
    })
  } finally {
    loading.value = false
  }
}
</script>