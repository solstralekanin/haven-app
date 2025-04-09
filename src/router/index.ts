import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
import People from "../views/People.vue";
import Projects from "../views/Projects.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/people", name: "People", component: People },
  { path: "/projects", name: "Projects", component: Projects },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
