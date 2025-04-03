<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/AppNavbar.vue';

export default {
  components: {
    NavBar
  }
};
</script>
