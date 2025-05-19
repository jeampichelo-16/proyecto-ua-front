<template>
  <div v-if="!isInitializing" class="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl px-8 py-10 space-y-8">
      <div class="text-center">
        <img src="https://mansercom.pe/wp-content/themes/mansercom/images/logotipo.svg" alt="Logo"
          class="w-24 mx-auto mb-6" />
        <h2 class="text-3xl font-extrabold text-gray-800">Iniciar sesión</h2>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
          <input v-model="email" type="email" required @blur="emailTouched = true"
            :class="{ 'border-red-500': emailTouched && !isEmailValid }" placeholder="ejemplo@correo.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd21f]" />
          <p v-if="emailTouched && !isEmailValid" class="text-xs text-red-600 mt-1">Ingresa un correo válido</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="••••••••"
              @blur="passwordTouched = true" :class="{ 'border-red-500': passwordTouched && !password }"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd21f]" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
            </button>
          </div>
          <p v-if="passwordTouched && !password" class="text-xs text-red-600 mt-1">La contraseña es obligatoria</p>
        </div>

        <!-- Rol -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
          <select v-model="role" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fdd21f]">
            <option disabled value="">Selecciona un rol</option>
            <option v-for="r in roles" :key="r" :value="r">{{ roleLabels[r] }}</option>
          </select>
        </div>

        <!-- Botón -->
        <div class="pt-2">
          <button :disabled="auth.loading || !canSubmit" type="submit"
            class="w-full py-3 font-bold text-black bg-[#fdd21f] rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
            {{ auth.loading ? 'Cargando...' : 'Entrar' }}
          </button>
        </div>
      </form>

      <!-- Recuperar contraseña -->
      <div class="text-center">
        <RouterLink :to="AuthRoutes.FORGOT_PASSWORD" class="text-sm font-semibold text-[#fdd21f] hover:underline">
          Alonso
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useProfileStore } from '../../stores/profileStore'
import { Role } from '../../types/user'
import { useSessionFlags } from '../../composables/useSessionFlags'
import { AuthRoutes, AdminRoutes, UserRoutes, ErrorRoutes } from '../../router/routeNames'
import { Eye, EyeOff } from 'lucide-vue-next'

// Campos
const email = ref('')
const password = ref('')
const role = ref<Role | ''>('')

// Validaciones
const emailTouched = ref(false)
const passwordTouched = ref(false)
const showPassword = ref(false)

const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
)
const isRoleValid = computed(() => role.value !== '')
const canSubmit = computed(() =>
  isEmailValid.value && !!password.value && isRoleValid.value
)

// Roles disponibles
const roles: Role[] = [Role.ADMIN, Role.EMPLEADO]
const roleLabels: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.EMPLEADO]: 'Empleado',
  [Role.OPERARIO]: 'Operario',
}

// Auth
const router = useRouter()
const auth = useAuthStore()
const profile = useProfileStore()
const { isInitializing } = useSessionFlags()
const error = ref(false)

const handleLogin = async () => {
  const success = await auth.login(email.value.trim(), password.value, role.value as Role)
  error.value = !success

  if (success) {
    // Redirección manual luego de login exitoso
    const redirections: Record<Role, string> = {
      [Role.ADMIN]: AdminRoutes.DASHBOARD,
      [Role.EMPLEADO]: UserRoutes.MANAGE_CLIENTS,
      [Role.OPERARIO]: ErrorRoutes.FORBIDDEN,
    }

    router.push(redirections[profile.role!])
  }
}
</script>
