import { defineConfig, loadEnv } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      devtools(),
      // nitro({
      //   ...(mode === 'development'
      //     ? {
      //         devProxy: {
      //           '/api/auth/**': {
      //             target: env.API_URL,
      //             changeOrigin: true,
      //           },
      //           '/api/graphql': {
      //             target: env.API_URL,
      //             changeOrigin: true,
      //           },
      //         },
      //       }
      //     : {}),
      // }),
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
      tanstackStart({
        spa: {
          enabled: true,
        },
      }),
      viteReact(),
    ],
    server: {
      proxy: {
        "/api/": {
          target: env.API_URL,
          changeOrigin: true,
        },
        "/socket.io/": {
          target: env.API_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});

export default config;
