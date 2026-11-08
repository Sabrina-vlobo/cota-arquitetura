/**
 * Converte as fotos exportadas do Figma (assets/images/*.jpg|png) em AVIF e WebP
 * em várias larguras, e grava o manifesto usado pelo componente <Photo>.
 *
 *   npm run images
 */
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets/images";
const OUT = "public/images";
const MANIFEST = "src/data/image-manifest.json";

/** Larguras-alvo por imagem (nunca maiores que o original). */
const TARGETS = {
  hero: [960, 1600, 2400, 3200],
  default: [640, 1000, 1600, 2200],
  equipe: [400, 700, 1000],
};

/** Largura mínima recomendada da foto original para ficar nítida em telas retina. */
const MIN_SOURCE = { hero: 2800, default: 1800, equipe: 1000 };

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
if (files.length === 0) {
  console.log(`Nenhuma imagem em ${SRC}/. Exporte as fotos do Figma para essa pasta.`);
  process.exit(0);
}
await mkdir(OUT, { recursive: true });

const manifest = {};
const warnings = [];
for (const file of files) {
  const name = path.parse(file).name.toLowerCase().replace(/\s+/g, "-").replace(/@\d+x$/, "");
  const input = sharp(path.join(SRC, file)).rotate();
  const { width, height } = await input.metadata();
  const kind = name === "hero" || name === "casa-lagoa" ? "hero" : name.startsWith("equipe") ? "equipe" : "default";
  const preset = TARGETS[kind];
  if (width < MIN_SOURCE[kind]) {
    warnings.push(`${name}: ${width}px de largura. O ideal é pelo menos ${MIN_SOURCE[kind]}px.`);
  }
  const widths = [...new Set(preset.map((w) => Math.min(w, width)))];

  for (const w of widths) {
    let resized = input.clone().resize({ width: w, kernel: "lanczos3" });
    // Um leve reforço de nitidez compensa a perda da redução de tamanho.
    if (w < width) resized = resized.sharpen({ sigma: 0.6 });
    await resized.clone().avif({ quality: 66, effort: 4, chromaSubsampling: "4:4:4" }).toFile(path.join(OUT, `${name}-${w}.avif`));
    await resized.clone().webp({ quality: 86, smartSubsample: true }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }

  // Cor média, usada como fundo enquanto a foto carrega
  const { channels } = await input.stats();
  const hex = `#${channels.slice(0, 3).map((c) => Math.round(c.mean).toString(16).padStart(2, "0")).join("")}`;

  manifest[name] = { widths, width, height, color: hex };
  console.log(`✓ ${name}  ${width}×${height}  →  ${widths.join(", ")}`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nManifesto atualizado em ${MANIFEST}`);
if (warnings.length) {
  console.log("\nFotos com resolução baixa (vão aparecer borradas em telas boas):");
  for (const w of warnings) console.log(`  ! ${w}`);
}
