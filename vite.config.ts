import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./src/data/image-manifest.json";

/**
 * Completa o <head> no build:
 * - URL absoluta para canonical e Open Graph (VITE_SITE_URL ou, na Vercel, o domínio de produção);
 * - preload da foto do hero, para ela não esperar o JavaScript.
 */
function headPlugin(): Plugin {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const site = (process.env.VITE_SITE_URL || (vercel ? `https://${vercel}` : "")).replace(/\/$/, "");
  const hero = manifest["casa-lagoa"];
  const srcset = hero.widths.map((w) => `/images/casa-lagoa-${w}.avif ${w}w`).join(", ");

  return {
    name: "cota-head",
    transformIndexHtml(html, ctx) {
      // A fonte principal começa a baixar junto com o HTML, sem esperar o CSS.
      const font = Object.keys(ctx.bundle ?? {}).find((f) => /archivo-latin-wght-normal.*\.woff2$/.test(f));
      const tags = [
        ...(font ? [`<link rel="preload" as="font" type="font/woff2" href="/${font}" crossorigin />`] : []),
        `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high" />`,
      ];
      if (site) {
        tags.push(
          `<link rel="canonical" href="${site}/" />`,
          `<meta property="og:url" content="${site}/" />`,
        );
      }
      return html
        .replaceAll("%SITE_URL%", site)
        .replace("</head>", `    ${tags.join("\n    ")}\n  </head>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), headPlugin()],
});
