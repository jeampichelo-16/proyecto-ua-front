<template>
  <div class="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
    <div class="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 sm:p-10 text-center space-y-8">
      <div class="text-7xl font-extrabold text-[#fdd21f]">404</div>

      <h2 class="text-3xl font-bold text-gray-800">
        ¡Ups! Página no encontrada
      </h2>

      <p class="text-gray-600 text-sm sm:text-base">
        Lo sentimos, la página que estás buscando no existe o fue movida.
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
