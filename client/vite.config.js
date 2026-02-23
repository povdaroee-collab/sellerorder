import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/', // 👈 ប្តូរមកជាសញ្ញា / វិញ (ឬលុបបន្ទាត់នេះចោលតែម្ដងក៏បាន)
})
