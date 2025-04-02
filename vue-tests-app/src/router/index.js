import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreateTest from '../views/CreateTest.vue';
import SolveTest from '../views/SolveTest.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/crear', component: CreateTest },
    { path: '/resolver/:id', component: SolveTest }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
