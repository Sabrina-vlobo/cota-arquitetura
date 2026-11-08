import manifest from "../data/image-manifest.json";
import type { ImageName } from "../data/content";

type Entry = { widths: number[]; width: number; height: number; color: string };
const images = manifest as Partial<Record<ImageName, Entry>>;

interface PhotoProps {
  name: ImageName;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * Foto responsiva (AVIF + WebP). Enquanto as imagens não forem geradas
 * com `npm run images`, mostra um fundo azul no lugar.
 */
export function Photo({ name, alt, sizes, className = "", priority = false, onLoad }: PhotoProps) {
  const entry = images[name];
  if (!entry) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-[linear-gradient(135deg,#9ab9d3,#5e7e9e)] ${className}`}
      />
    );
  }
  const srcset = (ext: string) => entry.widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(", ");
  const largest = entry.widths[entry.widths.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`/images/${name}-${largest}.webp`}
        alt={alt}
        width={entry.width}
        height={entry.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={onLoad}
        style={{ backgroundColor: entry.color }}
        className={className}
      />
    </picture>
  );
}
