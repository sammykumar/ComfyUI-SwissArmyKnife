import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        lib: {
            entry: './src/main.ts',
            formats: ['es'],
            fileName: 'vue-components',
        },
        rollupOptions: {
            // Externalize dependencies that should not be bundled
            external: [
                // ComfyUI scripts - these are provided by ComfyUI at runtime
                /^\.\.\/\.\.\/\.\.\/scripts\/.*/,
                '../../../scripts/app.js',
                '../../../scripts/api.js',
                '../../../scripts/domWidget.js',
                '../../../scripts/utils.js',
                // Vue ecosystem - these should be provided externally
                'vue',
                'vue-i18n',
                /^primevue\/?.*/, // Match all primevue imports
                /^@primevue\/themes\/?.*/, // Match all primevue theme imports
            ],
            output: {
                // Output to the web/js directory so ComfyUI can find it
                dir: '../web/js',
                assetFileNames: 'assets/[name].[ext]',
                entryFileNames: 'vue-components.js',
                // Preserve module structure for better debugging
                preserveModules: false,
            },
        },
        // Generate source maps for development
        sourcemap: false,
        // Don't inline assets as base64
        assetsInlineLimit: 0,
        // Don't split CSS into separate files
        cssCodeSplit: false,
        // Clear output directory before build
        emptyOutDir: true,
    },
});
