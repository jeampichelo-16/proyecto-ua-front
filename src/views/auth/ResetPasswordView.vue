<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-8">
      <div class="text-center">
        <img src="https://mansercom.pe/wp-content/themes/mansercom/images/logotipo.svg" alt="Logo"
          class="w-24 mx-auto mb-6" />
        <h2 class="text-3xl font-extrabold text-gray-800">Restablecer contraseña</h2>
        <p class="text-gray-600 text-sm mt-2">
          Ingresa tu nueva contraseña.
        </p>
      </div>

      <form @submit.prevent="handleReset" class="space-y-6">
        <!-- Nueva contraseña -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="••••••••" required
              minlength="6"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd21f]"
              :class="{ 'border-red-500': passwordTouched && !isPasswordValid }" @blur="passwordTouched = true" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
            </button>
          </div>
          <p v-if="passwordTouched && !isPasswordValid" class="text-xs text-red-600 mt-1">
            La contraseña debe tener al menos 6 caracteres.
          </p>
        </div>

        <!-- Confirmar contraseña -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
          <div class="relative">
            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="••••••••"
              required minlength="6"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd21f]"
              :class="{ 'border-red-500': confirmPasswordTouched && !isConfirmPasswordValid }"
              @blur="confirmPasswordTouched = true" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <component :is="showConfirmPassword ? EyeOff : Eye" class="w-5 h-5" />
            </button>
          </div>
          <p v-if="confirmPasswordTouched && !isConfirmPasswordValid" class="text-xs text-red-600 mt-1">
            Las contraseñas no coinciden.
          </p>
        </div>

        <!-- Botón -->
        <div>
          <button :disabled="loading || !canSubmit" type="submit"
            class="w-full py-3 font-bold text-black bg-[#fdd21f] rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
            {{ loading ? 'Procesando...' : 'Restablecer contraseña' }}
          </button>
        </div>
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
import { useRoute, useRouter } from 'vue-router'
import { notifySuccess, notifyError } from '../../utils/notify'
import { AuthRoutes } from '../../router/routeNames'
import { resetPassword } from '../../services/auth.service'
import { Eye, EyeOff } from 'lucide-vue-next'

// Campos
const route = useRoute()
const router = useRouter()
const token = route.query.token as string

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordTouched = ref(false)
const confirmPasswordTouched = ref(false)
const loading = ref(false)

// Validaciones
const isPasswordValid = computed(() => password.value.length >= 6)
const isConfirmPasswordValid = computed(() => password.value === confirmPassword.value)
const canSubmit = computed(() => isPasswordValid.value && isConfirmPasswordValid.value)

const handleReset = async () => {
  if (!token) {
    notifyError({ title: 'Token inválido', description: 'El enlace de recuperación no es válido.' })
    return
  }

  loading.value = true
  try {
    await resetPassword(token, password.value);

    notifySuccess({
      title: 'Contraseña actualizada',
      description: 'Ahora puedes iniciar sesión con tu nueva contraseña',
    });

    router.push(AuthRoutes.LOGIN);
  } catch (err) {
    notifyError({
      title: 'Error al restablecer la contraseña',
      description: 'No se pudo restablecer la contraseña. Por favor, inténtalo de nuevo más tarde.',
    });
  } finally {
    loading.value = false;
  }
}
</script>
