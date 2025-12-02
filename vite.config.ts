import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Plugin para garantir que todas as rotas redirecionem para index.html (SPA fallback)
    {
      name: "spa-fallback",
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            // Ignora requisições para arquivos estáticos (com extensão)
            if (req.url && req.url.includes(".") && !req.url.endsWith(".html")) {
              return next();
            }
            // Redireciona todas as outras rotas para index.html
            if (req.url && !req.url.startsWith("/api") && !req.url.startsWith("/_vite")) {
              req.url = "/index.html";
            }
            next();
          });
        };
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 8080,
  },
}));
