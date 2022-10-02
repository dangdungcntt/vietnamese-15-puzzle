import { createRouter, createWebHistory, RouteLocation } from 'vue-router';
import Home from './pages/Home.vue'
import ImagePage from './pages/mode/ImagePage.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/i/:imageName', component: ImagePage, props: true },
    { path: '/mode/image/:imageName', redirect: (to: RouteLocation) => ({ path: `/i/${to.params.imageName}` }) },
    { path: '/c/:mapSize', component: Home, props: true },
    { path: '/:mapSize', redirect: (to: RouteLocation) => ({ path: `/c/${to.params.mapSize}` }) },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router;