import { useEffect, useRef, useState } from "react";
import type { HeroVideo as HeroVideoData } from "../data/content";

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/** Decide se vale carregar o vídeo: respeita movimento reduzido, economia de dados e conexão lenta. */
function canLoadVideo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)2g|3g/.test(conn.effectiveType)) return false;
  return true;
}

/**
 * Vídeo de fundo do hero. A foto de capa (renderizada por baixo) já aparece de imediato;
 * o vídeo só é baixado depois que a página terminou de carregar e entra com fade quando
 * consegue tocar. Fica pausado quando o hero está coberto, fora de foco ou a aba escondida.
 */
export function HeroVideo({
  video,
  active,
  paused,
  onReady,
}: {
  video: HeroVideoData;
  /** O slide está na tela e o hero não está coberto pela página. */
  active: boolean;
  /** A pessoa pausou pelo botão. */
  paused: boolean;
  onReady?: (ready: boolean) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string>();
  const [ready, setReady] = useState(false);

  // Escolhe a versão e só define o src depois do carregamento da página.
  useEffect(() => {
    if (!canLoadVideo()) return;
    const pick = () => setSrc(window.matchMedia("(max-aspect-ratio: 1/1)").matches ? video.portrait : video.landscape);
    let idle = 0;
    const schedule = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      idle = ric ? ric(pick) : window.setTimeout(pick, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      window.clearTimeout(idle);
    };
  }, [video]);

  // Toca ou pausa conforme visibilidade, aba e escolha da pessoa.
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    const sync = () => {
      if (active && !paused && !document.hidden) el.play().catch(() => {});
      else el.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [active, paused, src, ready]);

  useEffect(() => onReady?.(ready), [ready, onReady]);

  if (!src) return null;

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-[var(--ease-in-out-strong)] ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

/** Botão de pausar/retomar o vídeo de fundo (exigido para movimento automático longo). */
export function VideoToggle({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={paused ? "Retomar vídeo" : "Pausar vídeo"}
      className="btn grid size-11 shrink-0 place-items-center border border-nevoa/30 bg-noite/40 text-nevoa backdrop-blur-md hover:bg-noite/60"
    >
      {paused ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <path d="M3.5 2v10l8-5z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <path d="M3 2h3v10H3zM8 2h3v10H8z" />
        </svg>
      )}
    </button>
  );
}
