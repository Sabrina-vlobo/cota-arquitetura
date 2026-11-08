import { useEffect, useRef } from "react";
import { useFinePointer } from "../lib/hooks";

/**
 * Cursor de prancheta: mira, coordenadas e linhas-guia.
 * Fica por cima do cursor do sistema (que continua visível), segue o mouse
 * sem atraso e só existe em dispositivos com mouse.
 */
export function Cursor() {
  const fine = useFinePointer();
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const coords = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const gx = useRef<HTMLDivElement>(null);
  const gy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    let x = -100;
    let y = -100;
    let raf = 0;
    let label = "";
    let guides = false;
    let light = false;

    const paint = () => {
      raf = 0;
      if (mark.current) mark.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (gx.current) gx.current.style.transform = `translate3d(0, ${y}px, 0)`;
      if (gy.current) gy.current.style.transform = `translate3d(${x}px, 0, 0)`;
      if (coords.current) coords.current.textContent = `X:${Math.round(x)}  Y:${Math.round(y)}`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const t = e.target as Element | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor-label]");
      const nextLabel = labelled?.dataset.cursorLabel ?? "";
      const nextGuides = !!t?.closest("[data-cursor-guides]");
      const nextLight = !!t?.closest('[data-tone="light"]') && !t?.closest(".on-dark");
      if (nextLabel !== label && tag.current) {
        label = nextLabel;
        tag.current.dataset.visible = String(!!label);
        if (label) tag.current.textContent = label;
      }
      if (nextGuides !== guides && root.current) {
        guides = nextGuides;
        root.current.dataset.guides = String(guides);
      }
      if (nextLight !== light && root.current) {
        light = nextLight;
        root.current.dataset.light = String(light);
      }
      if (root.current) root.current.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      if (root.current) root.current.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-guides="false"
      data-light="false"
      className="cursor-layer group/cursor text-ceu opacity-0 transition-opacity duration-200 data-[light=true]:text-aco"
    >
      <div
        ref={gx}
        className="absolute top-0 left-0 h-px w-full bg-current opacity-0 transition-opacity duration-300 group-data-[guides=true]/cursor:opacity-35"
      />
      <div
        ref={gy}
        className="absolute top-0 left-0 h-full w-px bg-current opacity-0 transition-opacity duration-300 group-data-[guides=true]/cursor:opacity-35"
      />
      <div ref={mark} className="absolute top-0 left-0">
        <span className="absolute -top-[5px] -left-[5px] block size-[10px] border-[1.5px] border-current" />
        <span
          ref={coords}
          className="absolute -top-6 left-3 font-mono text-[10px] tracking-[0.04em] whitespace-nowrap tabular"
        />
        <span
          ref={tag}
          data-visible="false"
          className="cursor-tag absolute top-4 left-3 origin-top-left bg-ceu px-2.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.06em] whitespace-nowrap text-noite uppercase group-data-[light=true]/cursor:bg-aco group-data-[light=true]/cursor:text-nevoa"
        />
      </div>
    </div>
  );
}
