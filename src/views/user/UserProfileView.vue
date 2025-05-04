<template>
    <div class="p-6 max-w-4xl space-y-6">
        <!-- Título -->
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-800">Perfil del Usuario</h1>
        </div>

        <!-- Card -->
        <div class="bg-white border border-gray-200 shadow rounded-lg p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nombre completo -->
                <div>
                    <label class="text-gray-500 text-sm block">Nombre completo</label>
                    <p class="text-gray-800 font-medium mt-1">
                        {{ profile.firstName || '—' }} {{ profile.lastName || '' }}
                    </p>
                </div>

                <!-- Usuario -->
                <div>
                    <label class="text-gray-500 text-sm block">Nombre de usuario</label>
                    <p class="text-gray-800 font-medium mt-1">
                        {{ profile.username || '—' }}
                    </p>
                </div>

                <!-- Email -->
                <div>
                    <label class="text-gray-500 text-sm block">Correo electrónico</label>
                    <p class="text-gray-800 font-medium mt-1">
                        {{ profile.email || '—' }}
                    </p>
                </div>

                <!-- Rol -->
                <div>
                    <label class="text-gray-500 text-sm block">Rol</label>
                    <p class="text-gray-800 font-medium mt-1 capitalize">
                        {{ profile.role?.toLowerCase() || '—' }}
                    </p>
                </div>

                <!-- Estado -->
                <div>
                    <label class="text-gray-500 text-sm block">Estado</label>
                    <span class="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full"
                        :class="profile.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                        {{ profile.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                </div>

                <!-- Email verificado -->
                <div>
                    <label class="text-gray-500 text-sm block">Email verificado</label>
                    <span class="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full"
                        :class="profile.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                        {{ profile.isEmailVerified ? 'Sí' : 'No' }}
                    </span>
                </div>

                <!-- Último acceso -->
                <div class="md:col-span-2">
                    <label class="text-gray-500 text-sm block">Último acceso</label>
                    <p class="text-gray-800 font-medium mt-1">
                        {{ formatDate(profile.lastLoginAt) }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '../../stores/profileStore'
import { formatDate } from '../../utils/date';

const profile = useProfileStore()


</script>