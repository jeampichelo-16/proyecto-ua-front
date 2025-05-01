<!-- src/views/ForbiddenView.vue -->
<template>
  <div class="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
    <div class="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 sm:p-10 text-center space-y-8">
      <!-- Ícono de advertencia -->
      <div class="flex justify-center">
        <svg class="w-20 h-20 text-[#fdd21f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01M4.93 19h14.14a2 2 0 001.73-3l-7.07-12a2 2 0 00-3.46 0l-7.07 12a2 2 0 001.73 3z" />
        </svg>
      </div>

      <div class="text-[#fdd21f] text-6xl font-extrabold">403</div>

      <h2 class="text-3xl font-bold text-gray-800">
        Acceso denegado
      </h2>

      <p class="text-gray-600 text-sm sm:text-base">
        No tienes permisos para acceder a esta página.
      </p>

      <RouterLink :to="AuthRoutes.LOGIN"
        class="inline-block bg-[#fdd21f] hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300">
        Volver al inicio
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthRoutes } from '../../router/routeNames'
</script>
