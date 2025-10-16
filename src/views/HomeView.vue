<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const sidebarCollapsed = ref(false)
let map

// Datos de prueba: 3 sectores
import { sectores } from '../data/sectores.js'


let polygons = {}

onMounted(() => {
  map = L.map('map').setView([18.5016, -88.3054], 14)
// Mapa base OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Dibujar polígonos de los sectores
  polygons = {}
  sectores.forEach(s => {
    const polygon = L.polygon(s.coords, {
      color: s.status == 'danger' ? 'red' : 'green',
      fillColor: s.status == 'danger' ? 'red' : 'green',
      fillOpacity: 0.4
    })
      .addTo(map)
      .bindPopup(s.name)
      .on('click', () => handlePolygonClick(s.id))
      .on('mouseover', () => polygon.setStyle({ fillOpacity: 0.6 }))
      .on('mouseout', () => polygon.setStyle({ fillOpacity: 0.4 }))

    polygons[s.id] = polygon
  })
})

const activePolygonId = ref(null)

const highlightSector = (sectorId) => {
  if (!polygons || Object.keys(polygons).length === 0) return
  // Resetear todos los polígonos
  Object.entries(polygons).forEach(([id, poly]) => {
    const sector = sectores.find(s => s.id === Number(id))
    poly.setStyle({
      color: sector.status == 'danger' ? 'red' : 'green',
      fillColor: sector.status == 'danger' ? 'red' : 'green',
      fillOpacity: 0.4
    })
  })

  // Resaltar el seleccionado
  const selected = polygons[sectorId]
  if (selected) {
    selected.setStyle({
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.6
    })
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
const modalPosition = ref({ top: 150, left: 500 })

let isDragging = false
let dragOffset = { x: 0, y: 0 }

const abrirModal = (sector) => {
  selectedSector.value = sector
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
    <button class="btn btn-light rounded-0 p-3 btn-collapse"
      :class="{ active: !sidebarCollapsed ,'rounded-end shadow-sm': sidebarCollapsed }"
      @click="sidebarCollapsed = !sidebarCollapsed">
      {{ sidebarCollapsed ? '⮞' : '⮜' }}
    </button>

    <!-- Barra lateeral -->
    <div
      class="barraLateral bg-light text-white d-flex flex-column m-0 p-0"
      :class="{ collapsed: sidebarCollapsed }"
    >
      <div 
        v-if="!sidebarCollapsed"
        style="height: 100vh; margin-top: 5px;"
        class="">
        
        <!-- Titulo de lista de sectores -->
        <div class="d-flex align-items-center bg-success justify-content-center mb-3 border-end border-white" style="height: 62px;">
            <h3 class="text-white fw-bold "> Sectores </h3>
        </div>
        
        <!-- Lista de sectores -->
        <div class="bg-light pt-2 px-4">
          <ul class="list-group">
            <li 
              v-for="sector in sectores" 
              :key="sector.id" 
              class="list-group-item list-group-item-action"
              @click="abrirModal(sector)"
            >
              <div class="row">
                <span class="col-10"> {{ sector.name }} </span>
                <i v-if="sector.status == 'secure'" class="bi bi-check-circle me-0 col-2 text-success"></i>
                <i v-if="sector.status == 'danger'" class="bi bi-exclamation-triangle me-0 col-2 text-danger"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Ventana modal draggable -->
    <div 
      v-if="modalVisible" 
      class="modal-draggable p-0 border-0" 
      :style="{ top: modalPosition.top + 'px', left: modalPosition.left + 'px' }"
      @mousedown.stop
    >
      <!-- Encabezado del modal -->
      <div 
        class="modal-header rounded-top"
        @mousedown="startDrag"
      >
        <!-- Pill de estado -->
        <i v-if="selectedSector.status == 'secure'" class="bi bi-check-circle-fill me-2 text-light fs-4 m-0 p-0"></i>
        <i v-if="selectedSector.status == 'danger'" class="bi bi-exclamation-triangle-fill me-2 text-light fs-4 m-0 p-0"></i>

        <!-- Nombre del sector -->
        <h5 class="m-0 p-0">{{ selectedSector.name }}</h5>

        <!-- Botón de cerrar -->
        <button class="btn-close p-2" @click="cerrarModal"></button>
      </div>

      <!-- Cuerpo del modal -->
      <div class="modal-body">

        <div class="mb-2">
          <p> <span>Colonias: </span>
            <ul>
              <li>{{ selectedSector.descripcion }}</li>
              <li> ... </li>
            </ul>
          </p>

          <p> <span>Manzanas: </span>
            <ul>
              <li>...</li>
              <li>...</li>
              <li>...</li>
            </ul>
          </p>

          <p>
            <span>Estado: </span>{{ selectedSector.status }}
          </p>

          <p>
            <span>Ultima nebulizacion: </span>{{ selectedSector.ultimaNebulizacion }}
          </p>
        </div>

        <div class="butom-report d-flex justify-content-end">
          <button type="button" class="btn btn-success d-flex align-items-center" style="background-color: #00796B;">
            Histograma
            <i class="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="MapContainer col p-4 ps-6" :class="{ expanded: sidebarCollapsed }">
      <div id="map"></div>
    </div>
  </div>
</template>

<style scoped>
.Container {
  height: calc(100vh - 70px);
  overflow: hidden;
}

.bg-success{
  background-color: #00796B !important;
}

.bg-success2{
  background-color: #81C784 !important;
}

/* Boton de la barra lateral */
.btn-collapse{
  position: fixed;
  width: 50px;
  z-index: 100;
  top: 75px;
  left: 0;
  background-color: #00796B;
  border:none;
  color: white;
  font-size: 20px;
  font-weight: bold;
  transition: left 0.10s ease;
}

.btn-collapse.active{
  left: 350px;
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
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
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
