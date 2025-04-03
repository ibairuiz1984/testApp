import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import TestView from "@/views/TestView.vue"; // Vista para resolver el test
import CreateTestView from "@/views/CreateTestView.vue";
import EditTestView from "@/views/EditTestView.vue";
const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/test/:id", name: "test", component: TestView, props: true },
  { path: "/create", name: "create", component: CreateTestView },
  {
    path: "/editar-test/:id",
    name: "edit-test",
    component: EditTestView
  }];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
