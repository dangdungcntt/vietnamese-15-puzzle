import { createRouter, createWebHistory, RouteLocation } from 'vue-router';
import Home from './pages/Home.vue'

const ImagePage = () => import('./pages/mode/ImagePage.vue');
const ContestPlay = () => import('./pages/mode/ContestPlay.vue');
const ContestGenerator = () => import('./pages/ContestGenerator.vue');

const routes = [
    { path: '/', component: Home },
    { path: '/contest', component: ContestGenerator },
    { path: '/contest/play/:pin', component: ContestPlay, props: true, name: 'contest-play' },
    { path: '/contest/:mapSize', component: ContestGenerator, props: true },
    { path: '/contest/:mapSize/play/:pin', component: ContestPlay, props: true, name: 'contest-play-custom' },
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