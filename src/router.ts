import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue'
import ImagePage from './pages/mode/ImagePage.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/mode/image/:imageName', component: ImagePage, props: true },
    { path: '/:mapSize', component: Home, props: true },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;