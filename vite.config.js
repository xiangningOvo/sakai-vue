import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        //https://cn.vitejs.dev/config/server-options#server-proxy
        server:{
            host: '0.0.0.0',
            port: 5173,
            open: true,
            proxy:{
                '/dev-api':{
                    target: 'http://localhost:8080',
                    ws: false,
                    changeOrigin: true,
                    secure: false,
                    rewrite:(path)=>path.replace(/^\/dev-api/,'')
                }
            }
        }
    };
});
