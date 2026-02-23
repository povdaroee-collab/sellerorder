import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/sellerorder/', // 👈 បន្ថែមបន្ទាត់នេះ (ត្រូវប្រាកដថាមានសញ្ញា / ទាំងសងខាង)
})