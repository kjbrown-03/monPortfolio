import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import chatHandler from "./api/chat.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [
      react(),
      {
        name: "dev-api-chat",
        configureServer(server) {
          server.middlewares.use("/api/chat", (req, res) => {
            // Vercel's Node runtime augments `res` with .status()/.json(); the
            // raw Vite dev server doesn't, so polyfill just enough of it here.
            if (!res.status) {
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
            }
            if (!res.json) {
              res.json = (payload) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(payload));
              };
            }
            chatHandler(req, res);
          });
        },
      },
    ],
  };
});
