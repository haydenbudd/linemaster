import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Stub out figma:asset imports for local builds (resolved by Figma Make at runtime)
function figmaAssetPlugin() {
  const FIGMA_ASSET_RE = /^figma:asset\//;
  const VIRTUAL_PREFIX = '\0figma-asset:';
  return {
    name: 'figma-asset-stub',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (FIGMA_ASSET_RE.test(id)) return VIRTUAL_PREFIX + id;
    },
    load(id: string) {
      if (id.startsWith(VIRTUAL_PREFIX)) {
        return 'export default ""';
      }
    },
  };
}

export default defineConfig({
  plugins: [
    figmaAssetPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
