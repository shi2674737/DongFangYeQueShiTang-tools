import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// 引入@vitejs/plugin-legacy
import legacy from '@vitejs/plugin-legacy';
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    // extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
  ],
})
