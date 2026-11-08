import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { numbers } from "../data/content";
import { useInView, useReducedMotion } from "../lib/hooks";

const MANIFESTO =
  "Desenhamos casas a partir de quem vai morar nelas. Cada medida tem um motivo: a luz da manhã, o caminho até a cozinha, o silêncio do quarto.";

const fmt = new Intl.NumberFormat("pt-BR");

/** Número que conta ao entrar na tela. O valor final já está no HTML. */
function CountUp({ value, start }: { value: number; start: boolean }) {
  const el = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!start || reduce || !el.current) return;
    const node = el.current;
    const duration = 1300;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      node.textContent = fmt.format(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      node.textContent = fmt.format(value);
    };
  }, [start, reduce, value]);

  return (
    <span ref={el} className="tabular" aria-hidden="true">
      {fmt.format(value)}
    </span>
  );
}

export function About() {
  const words = MANIFESTO.split(" ");
  const [numbersRef, numbersIn] = useInView<HTMLUListElement>({ threshold: 0.4 });
  const [pairRef, pairIn] = useInView<HTMLDivElement>();

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-titulo"
      className="relative z-10 scroll-mt-[72px] bg-nevoa text-grafite shadow-[0_-40px_80px_-30px_rgb(15_26_43/0.55)] lg:scroll-mt-[88px]"
      data-tone="light"
    >
      <div className="mx-auto max-w-[1440px] px-5 pt-28 pb-24 md:px-10 md:pt-40 md:pb-32 lg:px-16">
        <h2 id="sobre-titulo" className="sr-only">
          Sobre o escritório
        </h2>
        <p className="manifesto max-w-[23ch] text-[clamp(2rem,3.4vw+0.6rem,3.5rem)] leading-[1.16] font-light tracking-[-0.028em] md:max-w-[26ch] lg:max-w-[31ch]">
          {words.map((w, i) => (
            <span key={i} className="w" style={{ "--p": i / (words.length - 1) } as CSSProperties}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>

        <div
          ref={pairRef}
          data-inview={pairIn}
          className="mt-20 flex items-center gap-6 md:mt-28 md:gap-8"
          aria-label="Sensibilidade e precisão"
        >
          <span className="text-sm tracking-[0.22em] uppercase md:text-lg">Sensibilidade</span>
          <span aria-hidden="true" className="line-draw h-px flex-1 bg-linha-claro" />
          <span className="text-sm tracking-[0.22em] text-aco uppercase md:text-lg">Precisão</span>
        </div>

        <ul
          ref={numbersRef}
          data-inview={numbersIn}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-20 lg:grid-cols-4 lg:gap-8"
        >
          {numbers.map((n) => (
            <li key={n.label} className="border-t border-linha-claro pt-7">
              <span className="sr-only">
                {fmt.format(n.value)} {n.label}
              </span>
              <span className="block text-[clamp(3.25rem,5vw+1rem,6rem)] leading-none font-light tracking-[-0.04em]">
                <CountUp value={n.value} start={numbersIn} />
              </span>
              <span aria-hidden="true" className="mt-3 block text-[15px] text-ardosia md:text-base">
                {n.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
