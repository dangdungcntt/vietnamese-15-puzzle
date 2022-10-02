import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Puzzle Game',
                short_name: 'Puzzle Game',
                description: 'Puzzle Game by Nddcoder',
                background_color: '#57407c',
                theme_color: '#57407c',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    define: {
        '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    }
})
