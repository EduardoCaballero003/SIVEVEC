<template>
  <div class="reportes-container container-fluid p-4 m-0">
    <!-- Navegación lateral -->
    <div class="col-2 p-2">
      <div class="sidebar card p-4 m-0">
        <div class="container text-center d-flex align-items-center justify-content-center mb-3">
          <i class="bi bi-bar-chart me-2 text-green fs-4"></i>
          <h3 class="fw-bold text-green">Reportes</h3>
        </div>

        <button v-for="(tab, index) in tabs" :key="index"
          class="btn text-start text-white fw-semibold d-flex align-items-center justify-content-between px-3 py-2 rounded-3 mb-3"
          :class="[
            activeTab === tab.id ? 'bg-success shadow' : 'bg-green',
            'tab-button'
          ]" @click="activeTab = tab.id">
          <span>{{ tab.name }}</span>
          <i class="bi bi-caret-right-fill"></i>
        </button>
      </div>
    </div>

    <!-- Contenido dinámico -->
    <div class="main-content p-2 col-10 m-0">

      <h2 class="text-center mb-4">
        Reportes de Actividades de {{tabs.find(tab => tab.id === activeTab)?.name}} - Chetumal
      </h2>

      <div class="card p-4 content-card">


        <div class="content-scroll">
          <div v-if="activeTab === 'larvario'">
            <LarvarioChart />
          </div>
          <div v-if="activeTab === 'nebulizacion'">
            <NebulizacionChart />
          </div>
          <div v-if="activeTab === 'rociados'">
            <RociadoChart />
          </div>
          <div v-if="activeTab === 'ovitrampas'">
            <OvitrampasChart />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LarvarioChart from '../components/charts/LarvarioChart.vue'
import NebulizacionChart from '../components/charts/NebulizacionChart.vue'
import OvitrampasChart from '../components/charts/OvitrampasChart.vue'
import RociadoChart from '@/components/charts/RociadoChart.vue'

const activeTab = ref('larvario')
const tabs = [
  { id: 'larvario', name: 'Control Larvario' },
  { id: 'nebulizacion', name: 'Nebulización' },
  { id: 'rociados', name: 'Rociados' },
  { id: 'ovitrampas', name: 'Ovitrampas y Entomología' }
]
</script>

<style scoped>
/* === LAYOUT PRINCIPAL === */
.reportes-container {
  display: flex;
  height: calc(100vh - 70px);
  /* Mantiene la altura debajo del header */
  overflow: hidden;
  /* Evita scroll general */
}

/* === BARRA LATERAL === */
.sidebar {
  flex: 0 0 18%;
  /* Ancho fijo similar a col-2 */
  height: 100%;
  overflow-y: auto;
  /* Permite scroll interno si hay muchas pestañas */
}

/* === PANEL PRINCIPAL === */
.main-content {
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Tarjeta del contenido */
.content-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Zona interna de contenido (gráficas) */
.content-scroll {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

/* === COLORES === */
.bg-green {
  background-color: #00796B;
}

.text-green {
  color: #00796B;
}

.bg-green.active {
  background-color: rgba(0, 121, 107, 0.9);
}

/* Ajustes visuales opcionales */
.tab-button:hover {
  opacity: 0.9;
  transition: 0.2s;
}
</style>
