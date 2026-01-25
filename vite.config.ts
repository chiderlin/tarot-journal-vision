import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages 需要設置 base，格式為 /repository-name/
  // 如果你的 repo 名稱是 tarot-journal-vision，則設為 '/tarot-journal-vision/'
  // 如果部署到 username.github.io，則設為 '/'
  base: process.env.GITHUB_PAGES === 'true' ? '/tarot-journal-vision/' : '/',
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
