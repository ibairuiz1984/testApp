<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">🏠 Home</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/create" class="nav-link">📝 Crear/Modificar Tests</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/history" class="nav-link">📊 Historial</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppNavbar"
};
</script>

<style scoped>
/* Personalización del navbar */
.navbar {
  padding: 10px 20px;
}

.navbar-nav .nav-link {
  font-size: 1.2rem;
  margin: 0 10px;
  transition: color 0.3s ease;
}

.navbar-nav .nav-link:hover {
  color: #c1e1c1;
}
</style>
