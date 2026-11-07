import { fileURLToPath } from "node:url";
import { relative, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const base = "/mg-remont/";

// The same components serve Sites at / and GitHub Pages at /mg-remont/.
// Vite rebases CSS url() and HTML assets, but not string URLs in JSX or data.
// This transform is used only by this config and leaves source files intact.
function rebasePublicMedia(): Plugin {
  return {
    name: "mg-remont-pages-media",
    enforce: "pre",
    generateBundle() {
      this.emitFile({ type: "asset", fileName: ".nojekyll", source: "" });
    },
    transform(code, id) {
      const sourcePath = relative(projectRoot, id.split("?")[0]).replaceAll("\\", "/");
      if (!/^(app|components)\/.*\.[cm]?[jt]sx?$/.test(sourcePath)) return null;
      const rebased = code.replace(/(["'])\/media\//g, (_match, quote: string) => `${quote}${base}media/`);
      return rebased === code ? null : { code: rebased, map: null };
    },
  };
}

export default defineConfig({
  root: resolve(projectRoot, "github-pages"),
  base,
  publicDir: resolve(projectRoot, "public"),
  plugins: [rebasePublicMedia(), react()],
  resolve: { alias: { "@": projectRoot } },
  css: { postcss: projectRoot },
  build: {
    outDir: resolve(projectRoot, "dist-pages"),
    emptyOutDir: true,
  },
});
