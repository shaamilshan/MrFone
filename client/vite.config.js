import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // server: {
  //   hmr: {
  //     overlay: false, 
  //   },
  // },
  plugins: [react()],
  resolve: { 
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "./src/Common"),
      "@redux": path.resolve(__dirname, "./src/redux"),
    },
  },
});