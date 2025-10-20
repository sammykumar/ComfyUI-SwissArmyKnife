import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./ui', import.meta.url)),
        },
    },
    build: {
        lib: {
            entry: './ui/main.ts',
            formats: ['es'],
            fileName: 'main',
        },
        rollupOptions: {
            external: [
                '../../../scripts/app.js',
                '../../../scripts/api.js',
                '../../../scripts/domWidget.js',
                '../../../scripts/utils.js',
                'vue',
                'vue-i18n',
                /^primevue\/?.*/,
                /^@primevue\/themes\/?.*/,
            ],
            output: {
                dir: 'web/js/vue',
                assetFileNames: 'assets/[name].[ext]',
                entryFileNames: 'swiss-army-knife-vue.js',
            },
        },
        outDir: 'web/js/vue',
        sourcemap: false,
        assetsInlineLimit: 0,
        cssCodeSplit: false,
    },
});
