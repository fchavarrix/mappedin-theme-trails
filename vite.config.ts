import { defineConfig } from 'vite';

// Served from its own subdomain (theme-trails-demo.atlas-lac.com), so assets live at the root.
export default defineConfig({
  base: '/',
});
