import { defineConfig } from "astro/config";
import alpinejs from "@astrojs/alpinejs";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [alpinejs({ entrypoint: "/src/entrypoint-alpine" })],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    open: true,
  },
  compressHTML: false,
});
