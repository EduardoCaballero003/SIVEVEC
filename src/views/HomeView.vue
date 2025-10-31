<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const sidebarCollapsed = ref(false)
let map

// Datos de prueba: 3 sectores
import { sectores } from '../data/sectores.js'
import { nebulizacion } from '../data/nebulizacion.js'
import { controlLarvario } from '@/data/controlLarvario.js'
import { ovitrampas } from '@/data/ovitrampas.js'

function calcularRiesgoSector(larvario, ovitrampa) {
  const ic = (larvario.depositos_positivos / larvario.casas_trabajadas) * 100;
  const promedioHuevos = ovitrampa.promedio_huevos;
  const trampasPositivas = ovitrampa.positiva ? 100 : 0; // solo 1 trampa por sector en este ejemplo

  if (ic > 8 || promedioHuevos > 80 || trampasPositivas > 40) return 'high';
  if ((ic >= 5 && ic <= 8) || (promedioHuevos >= 50 && promedioHuevos <= 80)) return 'medium';
  return 'low';
}

sectores.forEach(sector => {
  const larvario = controlLarvario.find(l => l.id_sector === sector.id);
  const ovitrampa = ovitrampas.find(o => o.id_sector === sector.id);
  if (larvario && ovitrampa) {
    sector.status = calcularRiesgoSector(larvario, ovitrampa); // 'low' | 'medium' | 'high'
  }
})

let polygons = {}

onMounted(() => {
  map = L.map('map').setView([18.5016, -88.3054], 14)
  // Mapa base OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Dibujar polígonos de los sectores
  polygons = {}
  sectores.forEach(sector => {

    const polygon = L.polygon(sector.coords, {
      color: getColorByStatus(sector.status),
      fillColor: getColorByStatus(sector.status),
      fillOpacity: 0.4
    })
      .addTo(map)
      .on('click', () => handlePolygonClick(sector.id))
      .on('mouseover', () => polygon.setStyle({ fillOpacity: 0.6 }))
      .on('mouseout', () => polygon.setStyle({ fillOpacity: 0.4 }))

    polygons[sector.id] = polygon

    const active_nebulizacion = nebulizacion.find(n => n.id_sector === sector.id)

    if (sector.status == "high" || sector.status == "medium") {
      const center = polygon.getBounds().getCenter()

      const marker = L.marker(center, {
        title: `Intervencion necesaria en ${sector.name}`
      })
        .addTo(map)
        .bindPopup(`<b>${sector.name}</b><br>Intervencion necesaria`)
    }
  })
})

function getColorByStatus(status) {
  switch (status) {
    case 'high': return 'red';
    case 'medium': return 'orange';
    case 'low': return 'green';
    default: return 'green';
  }
}

const highlightSector = (sectorId) => {
  if (!polygons || Object.keys(polygons).length === 0) return;

  Object.entries(polygons).forEach(([id, poly]) => {
    const sector = sectores.find(s => s.id === Number(id));
    poly.setStyle({
      color: getColorByStatus(sector.status),
      fillColor: getColorByStatus(sector.status),
      fillOpacity: 0.4
    });
  });

  if (!sectorId) return;

  const selected = polygons[sectorId];
  if (selected) {
    selected.setStyle({
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.6
    });
  }
}

// Ajustar mapa cuando la barra lateral cambia
watch(sidebarCollapsed, () => {
  setTimeout(() => {
    map.invalidateSize()
  }, 300)
})

// Modal
const modalVisible = ref(false)
const selectedSector = ref({})
const sectorLarvario = ref({})
const sectorOvitrampas = ref({})
const UltimaNebulizacion = ref({})
const modalPosition = ref({ top: 150, left: 500 })

let isDragging = false
let dragOffset = { x: 0, y: 0 }

const abrirModal = (sector) => {
  selectedSector.value = sector
  sectorLarvario.value = controlLarvario.find(l => l.id_sector === sector.id);
  sectorOvitrampas.value = ovitrampas.find(o => o.id_sector === sector.id);
  UltimaNebulizacion.value = nebulizacion.find(p => p.id_sector == sector.id);
  modalVisible.value = true
  highlightSector(sector.id)
  if (map && sector.coords && sector.coords[0]) {
    map.setView(sector.coords[0], 15)
  }
}

// Cuando se hace click en el poligono en el mapa
const handlePolygonClick = (sectorId) => {
  const sector = sectores.find(s => s.id === sectorId)
  if (sector) abrirModal(sector)
}

const cerrarModal = () => {
  modalVisible.value = false
  modalPosition.value.top = 200;
  modalPosition.value.left = 500;

  highlightSector(null)

  // Alejar con animación tipo "fly"
  if (map) {
    map.flyTo([18.5016, -88.3054], 14, {
      animate: true,
      duration: 1.5 // segundos
    })
  }
}

// Drag
const startDrag = (e) => {
  isDragging = true
  dragOffset.x = e.clientX - modalPosition.value.left
  dragOffset.y = e.clientY - modalPosition.value.top
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging) return
  modalPosition.value.left = e.clientX - dragOffset.x
  modalPosition.value.top = e.clientY - dragOffset.y
}

const stopDrag = () => {
  isDragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}
</script>

<template>
  <div class="Container row m-0 p-0">
    <!-- Boton activar de Barra lateral -->
    <button class="btn btn-light rounded-0 p-3 btn-collapse rounded-end"
      :class="{ active: !sidebarCollapsed, 'shadow-sm': sidebarCollapsed }"
      @click="sidebarCollapsed = !sidebarCollapsed">
      {{ sidebarCollapsed ? '⮞' : '⮜' }}
    </button>

    <!-- Barra lateeral -->
    <div class="barraLateral bg-light text-white d-flex flex-column m-0 p-0 position-relative"
      :class="{ collapsed: sidebarCollapsed }">
      <div v-if="!sidebarCollapsed" style="height: 100vh; margin-top: 5px;" class="">

        <!-- Titulo de lista de sectores -->
        <div class="d-flex align-items-center bg-success justify-content-center mb-3 border-end border-white"
          style="height: 62px;">
          <h3 class="text-white fw-bold "> Sectores </h3>
        </div>

        <!-- Lista de sectores -->
        <div class="bg-ligth pt-2 px-4">
          <ul class="list-group shadow">
            <li v-for="sector in sectores" :key="sector.id" class="list-group-item list-group-item-action"
              :class="sector.id == selectedSector.id ? 'bg-success text-white' : ''" @click="abrirModal(sector)">
              <div class="row">
                <span class="col-10"> {{ sector.name }} </span>
                <i v-if="sector.status == 'low'" class="bi me-0 col-2"
                  :class="sector.id == selectedSector.id ? 'text-white bi-check-circle-fill' : 'bi-check-circle text-success'"></i>
                <i v-if="sector.status == 'medium'" class="bi me-0 col-2"
                  :class="sector.id == selectedSector.id ? 'bi-exclamation-circle-fill text-white' : 'bi-exclamation-circle text-warning'"></i>
                <i v-if="sector.status == 'high'" class="bi me-0 col-2"
                  :class="sector.id == selectedSector.id ? 'text-white bi-exclamation-triangle-fill' : 'bi-exclamation-triangle text-danger'"></i>
              </div>
            </li>
          </ul>
        </div>

        <div class="pt-2 p-4 position-absolute w-100" style="bottom: 77px;">
          <div class="bg-white rounded p-4 shadow">
            <button type="button" class="btn btn-success bg-success">
              <i class="bi bi-download fs-3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ventana modal draggable -->
    <div v-if="modalVisible" class="modal-draggable p-0 border-0"
      :style="{ top: modalPosition.top + 'px', left: modalPosition.left + 'px' }" @mousedown.stop>
      <!-- Encabezado del modal -->
      <div class="modal-header rounded-top" @mousedown="startDrag">
        <!-- Pill de estado -->
        <i v-if="selectedSector.status == 'secure'" class="bi bi-check-circle-fill me-2 text-light fs-4 m-0 p-0"></i>
        <i v-if="selectedSector.status == 'danger'"
          class="bi bi-exclamation-triangle-fill me-2 text-light fs-4 m-0 p-0"></i>

        <!-- Nombre del sector -->
        <h5 class="m-0 p-0">{{ selectedSector.name }}</h5>

        <!-- Botón de cerrar -->
        <button class="btn-close p-2" @click="cerrarModal"></button>
      </div>

      <!-- Cuerpo del modal -->
      <div class="modal-body">

        <div class="mb-2">
          <div> <span>Colonias: </span>
            <ul>
              <li>{{ selectedSector.descripcion }}</li>
            </ul>
          </div>

          <div> <span>Manzanas: </span>
            <ul>
              <li>...</li>
            </ul>
          </div>

          <p class="opacity-75 text-white fw-bold text-center rounded-pill w-50 m-auto my-2 py-1"
            :class="selectedSector.status == 'high' ? 'bg-danger' : selectedSector.status == 'medium' ? 'bg-warning' : 'bg-success'">
            {{ selectedSector.status == "high" ? "Riesgo" : selectedSector.status == 'medium' ? "Alerta" : "Seguro" }}
          </p>

          <p>
            <span v-if="sectorLarvario && sectorOvitrampas">
              casas con criaderos: {{ ((sectorLarvario.depositos_positivos / sectorLarvario.casas_trabajadas) *
                100).toFixed(2)
              }}%<br />
              promedio Huevos = {{ sectorOvitrampas.promedio_huevos }} <br />
              trampas Positivas = {{ sectorOvitrampas.positiva ? 100 : 0 }}
            </span>

            <span v-else>
              casas con criaderos: 2% <br />
              promedio Huevos = 10 <br />
              trampas Positivas = 20
            </span>
          </p>

          <p>
            <span>Ultima nebulizacion: </span>{{ UltimaNebulizacion ? UltimaNebulizacion.fecha : "12/10/2025" }}
          </p>
        </div>

        <div class="butom-report d-flex justify-content-end">
          <button type="button" class="btn btn-success d-flex align-items-center me-2"
            style="background-color: #00796B;">
            Acciones
            <i class="bi bi-arrow-right ms-2"></i>
          </button>
          <button type="button" class="btn btn-success d-flex align-items-center" style="background-color: #00796B;">
            Histograma
            <i class="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="MapContainer col p-4 ps-6" :class="{ expanded: sidebarCollapsed }">
      <div id="map" class="shadow rounded"></div>
    </div>
  </div>
</template>

<style scoped>
.Container {
  height: calc(100vh - 70px);
  overflow: hidden;
}

.bg-success {
  background-color: #00796B !important;
}

.bg-success2 {
  background-color: #81C784 !important;
}

/* Boton de la barra lateral */
.btn-collapse {
  position: fixed;
  width: 50px;
  z-index: 100;
  top: 75px;
  left: 0;
  background-color: #00796B;
  border: none;
  color: white;
  font-size: 20px;
  font-weight: bold;
  transition: left 0.10s ease;
}

.btn-collapse.active {
  left: 360px;
}

/* Barra lateral */
.barraLateral {
  width: 400px;
  transition: width 0.10s ease;
}

.barraLateral.collapsed {
  width: 0px;
}

.list-group-item:hover {
  cursor: pointer;
  background-color: #d4edda;
}

/* Contenedor del mapa */
.MapContainer {
  transition: width 0.3s ease;
  z-index: 2;
  height: 100%;
  padding: 0;
}

/* Div del mapa */
#map {
  width: 100%;
  height: 100%;
}

.modal-draggable {
  position: absolute;
  width: 350px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.modal-header {
  background-color: #00796B;
  color: white;
  padding: 10px 5px 5px 10px;
  cursor: move;
}

.modal-body {
  padding: 10px;
}

.btn-close {
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>
