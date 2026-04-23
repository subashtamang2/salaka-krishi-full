import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { resolve } from "node:path";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        server: {
            allowedHosts: ["localhost"],
            port: Number(env.VITE_APP_PORT),
            hmr: {
                overlay: true,
            },
        },
        plugins: [react(), checker({ typescript: true })],
        resolve: {
            alias: {
                "@src": resolve(__dirname, "./src/"),
                "@assets": resolve(__dirname, "./src/assets/"),
                "@components": resolve(__dirname, "./src/components/"),
                "@data": resolve(__dirname, "./src/data/"),
                "@layouts": resolve(__dirname, "./src/layouts/"),
                "@pages": resolve(__dirname, "./src/pages/"),
                "@router": resolve(__dirname, "./src/router/"),
                "@schema": resolve(__dirname, "./src/schema/"),
                "@utils": resolve(__dirname, "./src/utils/"),
                "@store": resolve(__dirname, "./src/store/"),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ["react", "react-dom"],
                    },
                },
            },
            chunkSizeWarningLimit: 1000,
        },
        // esbuild: {
        //     // This will drop all console.log and debugger statements
        //     drop: ['console'],
        // },
    };
});
