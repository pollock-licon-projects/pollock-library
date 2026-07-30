import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // 👇 プロキシ設定を追加
    proxy: {
      '/api': {
        target: 'http://backend:8000', // Docker Compose 内のコンテナサービス名
        changeOrigin: true,
      },
      '/static': {
        target: 'http://backend:8000', // サムネイルやPDF取得用
        changeOrigin: true,
      },
    },
  },
});