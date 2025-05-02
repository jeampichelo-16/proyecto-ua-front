<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Panel Administrativo</h1>
    <p class="text-gray-600">Vista exclusiva para administradores.</p>

    <!-- Tarjetas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardDashboard title="Clientes" :value="resumen.clientes" />
      <CardDashboard title="Solicitudes" :value="resumen.solicitudes" />
      <CardDashboard title="Operadores Activos" :value="resumen.operadoresActivos" />
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartLine title="Tasa de Cotizaciones Procesadas (%)" :data="cotizaciones" label="tasa" />
      <ChartLine title="Promedio Tiempo de Respuesta (hrs)" :data="tiempos" label="respuesta_horas" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { resumenDashboard as resumen, cotizacionesProcesadas as cotizaciones, tiemposRespuesta as tiempos } from '../../data/dashboard.data'
import CardDashboard from '../../components/CardDashboard.vue'
import ChartLine from '../../components/ChartLine.vue'
</script>
