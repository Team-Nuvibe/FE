import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   // 0.0.0.0 => 모바일(외부 IP)에서 접속 가능
  //   host: true,

  //   // 프록시 설정
  //   proxy: {
  //     // /api로 시작하는 요청을 백엔드로 토스
  //     "/api": {
  //       target: "http://43.200.96.34/",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
});
