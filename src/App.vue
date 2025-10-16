<script setup>
import { ref } from 'vue'

const UserCollapsed = ref(false)

</script>

<template>
  <div>
    <!-- 🔹 Navbar superior -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-light" style="min-height: 70px;">
      <div class="container-fluid">

        <!-- Botón responsive -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Logo / Marca -->
        <div to="/" class="navbar-brand d-flex align-items-center">
          <img
            src="@/assets/logo2.png"
            width="200"
            alt="Vue logo"
            class="me-5"
          />
        </div>

        <!-- Enlaces de navegación -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item me-3">
              <RouterLink to="/" class="nav-link rounded text-dark fs-5" active-class="active" exact>
                <i class="bi bi-map me-2"></i> 
                Mapa
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink to="/Reports" class="nav-link rounded text-dark fs-5" active-class="active" exact>
                <i class="bi bi-bar-chart"></i>
                Reportes
              </RouterLink>
            </li>

            <li class="nav-item me-3">
              <RouterLink to="/Brigade" class="nav-link rounded text-dark fs-5" active-class="active" exact>
                <i class="bi bi-person-walking"></i> 
                Brigadas
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="ms-auto me-3">
          <div class="tools bg-light rounded-bottom" :class="{ active: UserCollapsed}">

            <button type="buttom" class="btn btn-success bg-green m-auto mb-2">
              <i class="bi bi-gear-fill"></i>
            </button>

            <br/>

            <button type="buttom" class="btn btn-success bg-green m-auto mb-2">
              <i class="bi bi-moon-fill"></i>
            </button>

            <br/>

            <button type="buttom" class="btn btn-success bg-green m-auto mb-4">
              <i class="bi bi-question-circle-fill"></i>
            </button>

            <br/>

            <div 
              class="circleAvatar rounded-circle bg-green d-flex align-items-center justify-content-center text-white"
              style="width: 52px; height: 52px;"
              @click="UserCollapsed = !UserCollapsed"
            >
              <i class="bi bi-person-fill fs-1"></i>
            </div>
          </div>
        </div>
        
      </div>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>

/* Puedes ajustar colores o márgenes según tu estilo */
main {
  min-height: calc(100vh - 70px);
}

.tools{
  position:fixed;
  top: -158px;
  right: 3px;
  padding: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: top 0.5s ease;
}

.tools.active{
  top: 10px;
}

/* Opcional: activa color distinto en el enlace activo */
.nav-link.active {
  background-color: rgba(0, 121, 107,1);
  color: white !important;
}

.bg-green{
  background-color: #00796B;
}
</style>
