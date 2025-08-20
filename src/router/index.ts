// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ComputersView from '../views/Products/ComputersView.vue';
import BuyView from "../views/Products/ProductBuy.vue";
import TabletsView from "../views/Products/TabletsView.vue";
import DYCView from "../views/Products/DronesOCamerasView.vue";
import AudioView from "../views/Products/AudioView.vue";
import MobileView from "../views/Products/MobileView.vue";
import TVHomeCinemaView from "../views/Products/TV&HomeCinemaView.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  { path: "/computers", name: "Computer", component: ComputersView },
  { path: "/tablets", name: "Tablet", component: TabletsView },
  { path: "/drones-cameras", name: "D&C", component: DYCView },
  { path: "/audio", name: "Audio", component: AudioView },
  { path: "/mobile", name: "Mobile", component: MobileView },
  { path: "/tv-home-cinema", name: "TV-HomeCinema", component:TVHomeCinemaView},
  { path: "/product/:productId", name: "Buy", component: BuyView, props: true },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});



export default router;
