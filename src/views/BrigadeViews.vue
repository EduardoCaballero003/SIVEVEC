<template>
  <div class="container-fluid bg-dangeer p-3">
    <div class="searchBar w-75 m-auto d-flex row mb-3">

      <div class="col-5">
        <div class="input-group shadow-sm">
          <span class="input-group-text bg-success text-white border-0" id="basic-addon1">
            <i class="bi bi-search fs-5"></i>
          </span>
          <input type="text" class="form-control" placeholder="Buscar" aria-label="Buscar"
            aria-describedby="basic-addon1">
        </div>
      </div>

      <div class="col-2">
        <select class="col-3 form-select shadow-sm">
          <option value="brigada1">Brigada 1</option>
          <option value="brigada2">Brigada 2</option>
          <option value="brigada3">Brigada 3</option>
          <option value="brigada4">Brigada 4</option>
        </select>
      </div>

      <div class="col-3">
        <select class="col-3 form-select shadow-sm">
          <option value="brigada1"> Sector 1</option>
          <option value="brigada2"> Sector 2</option>
          <option value="brigada3"> Sector 3</option>
          <option value="brigada4"> Sector 4</option>
        </select>
      </div>

      <div class="col-1">
        <button type="button" class="btn btn-success bg-success w-100 shadow">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>

      <div class="col-1">
        <button type="button" class="btn btn-success bg-success w-100 shadow">
          <i class="bi bi-download"></i>
        </button>
      </div>

    </div>

    <div class="w-75 m-auto mt-4">
      <table class="table table-hover table-bordered align-middle text-center">
        <thead class="table-light">
          <tr>
            <th class="bg-success text-white fw-bold">Brigada</th>
            <th class="bg-success text-white fw-bold">Actividad</th>
            <th class="bg-success text-white fw-bold">Sector</th>
            <th class="bg-success text-white fw-bold">Colonia</th>
            <th class="bg-success text-white fw-bold">Manzanas</th>
            <th class="bg-success text-white fw-bold">
              <i class="bi bi-trash-fill"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brigada 1</td>
            <td>Nebulización</td>
            <td>Sector 3</td>
            <td>Col. Centro</td>
            <td>12</td>
            <td>
              <button type="button" class="btn btn-danger opacity-75">
                <i class="bi bi-trash-fill"></i>
              </button>
            </td>
          </tr>
          <tr>
            <td>Brigada 2</td>
            <td>Control Larvario</td>
            <td>Sector 5</td>
            <td>Col. Bicentenario</td>
            <td>8</td>
            <td>
              <button type="button" class="btn btn-danger opacity-75">
                <i class="bi bi-trash-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
input[type="text"],
select,
button {
  height: 45px;
}

input[type="text"]:focus,
select:focus {
  box-shadow: none;
  border-color: #00796B;
}

thead tr:first-child {
  border-radius: 10px 0 0 0;
}

.bg-success {
  background-color: #00796B !important;
}
</style>
