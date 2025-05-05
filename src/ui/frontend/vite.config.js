import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"
import pluginExternal from "vite-plugin-external"
import topLevelAwait from "vite-plugin-top-level-await"

const __dirname = dirname(fileURLToPath(import.meta.url))
const iconsPath = "node_modules/@shoelace-style/shoelace/dist/assets/icons"

export default defineConfig({
  base: "./",
  resolve: {
    alias: [
      {
        find: /\/assets\/icons\/(.+)/,
        replacement: `${iconsPath}/$1`,
      },
    ],
  },
  build: {
    outDir: "../frontend-dist",
    modulePreload: false,
    rollupOptions: {
      input: {
        connect: resolve(__dirname, "connect.html"),
        settings: resolve(__dirname, "settings.html"),
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: iconsPath,
          dest: "assets",
        },
      ],
    }),
    pluginExternal({
      externals: {
        webui: "webui"
      }
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
  ],
})