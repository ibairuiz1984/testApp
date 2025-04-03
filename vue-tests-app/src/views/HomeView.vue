<template>
  <div class="container mt-5">
    <h1 class="mb-4">Lista de Tests</h1>
    <ul class="list-group">
      <li v-for="test in tests" :key="test.id"
        class="list-group-item d-flex justify-content-between align-items-center">
        <router-link :to="'/test/' + test.id" class="text-decoration-none">
          {{ test.title }}
        </router-link>

        <!-- Botones de edición y eliminación -->
        <div>
          <button @click="editarTest(test.id)" class="btn btn-warning btn-sm mx-1">
            Editar
          </button>
          <button @click="eliminarTest(test.id)" class="btn btn-danger btn-sm">
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";


export default {
  name: "HomeView",
  data() {
    return {
      tests: []
    };
  },
  async created() {
    await this.cargarTests();
  },
  methods: {
    async cargarTests() {
      try {
        const querySnapshot = await getDocs(collection(db, "tests"));
        this.tests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || "Sin título"
        }));
      } catch (error) {
        console.error("Error cargando los tests:", error);
      }
    },
    editarTest(testId) {
      // Redirigir a la vista de edición del test
      this.$router.push(`/editar-test/${testId}`);
    },
    async eliminarTest(testId) {
      try {
        await deleteDoc(doc(db, "tests", testId));
        this.tests = this.tests.filter(test => test.id !== testId);
      } catch (error) {
        console.error("Error eliminando el test:", error);
      }
    }
  }
};
</script>

<style scoped>
/* Personaliza los estilos si es necesario */
</style>
