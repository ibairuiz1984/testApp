import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el router
import './firebase'; // Importa Firebase

const app = createApp(App);
app.use(router);
app.mount('#app');
