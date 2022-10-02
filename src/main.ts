import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

console.log(`APP VERSION: ${__APP_VERSION__}`);

createApp(App)
    .use(router)
    .mount('#app')
