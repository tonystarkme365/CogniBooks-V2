import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    target: ["es2020", "chrome95", "firefox91", "safari14"],
    minify: "esbuild",
    cssMinify: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
      onwarn(warning, warn) {
        // Log all warnings, suppress only known benign ones
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 1200,
    // Verbose esbuild logging
    reportCompressedSize: true,
  },
  esbuild: {
    logLevel: 'verbose',
    logLimit: 0,
    treeShaking: true,
    pure: ['console.log', 'console.debug'],
  },
  // Enable all logging
  logLevel: 'info',
  // Disable silent mode
  silent: false,
});