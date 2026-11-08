import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { services } from "../data/content";
import type { ServiceId } from "../data/content";
import { useFinePointer, useInView } from "../lib/hooks";
import { ServiceDrawing } from "./Drawings";

/**
 * Serviços como uma prancha azul (blueprint): a única seção em cor cheia da página.
 * O desenho técnico ocupa o palco; a lista à direita troca o desenho.
 */
export function Services() {
  const [active, setActive] = useState<ServiceId>("arquitetura");
  const [stageRef, stageIn] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const finePointer = useFinePointer();
  const current = services.find((s) => s.id === active)!;

  const onKey = (e: KeyboardEvent, index: number) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | undefined;
    if (e.key in keys) next = (index + keys[e.key] + services.length) % services.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = services.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    setActive(services[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section
      id="servicos"
      aria-labelledby="servicos-titulo"
      data-cursor-guides
      className="blueprint on-dark relative z-10 scroll-mt-[72px] overflow-hidden bg-prancha text-nevoa lg:scroll-mt-[88px]"
    >
      <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28 lg:px-16 lg:py-[clamp(3rem,7dvh,5rem)]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-end lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)] xl:gap-20">
          <h2
            id="servicos-titulo"
            className="text-[clamp(2.75rem,6vw+0.5rem,6rem)] leading-[0.98] lg:text-[clamp(2.75rem,3.4vw+0.5rem,4.5rem)] font-light tracking-[-0.04em]"
          >
            Do terreno
            <br className="lg:hidden" /> à chave na mão.
          </h2>
          <p className="max-w-[44ch] text-lg leading-relaxed text-nevoa/80 lg:pb-2 lg:text-base">
            Quatro frentes que podem ser contratadas juntas ou separadas. Atendemos projetos residenciais a partir de
            150 m², em São Paulo e no interior.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:mt-[clamp(2rem,5dvh,3.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)] xl:gap-20">
          {/* Palco do desenho */}
          <div
            ref={stageRef}
            data-inview={stageIn}
            id="servico-desenho"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            className="relative flex min-h-[340px] flex-col border border-nevoa/25 bg-prancha-escura/40 p-5 md:min-h-[520px] md:p-10 lg:h-[clamp(400px,calc(100dvh-330px),620px)] lg:min-h-0 lg:p-8"
          >
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
              <span key={pos} aria-hidden="true" className={`absolute ${pos} font-mono text-sm leading-none text-ceu`}>
                +
              </span>
            ))}
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[11px] tracking-[0.06em] text-ceu uppercase">
              <span>{current.drawing}</span>
              <span className="tabular">Esc. 1:100</span>
            </div>
            <div key={active} className="flex flex-1 items-center py-6 md:py-10 lg:relative lg:min-h-0 lg:py-0">
              <div className="w-full lg:absolute lg:inset-0 lg:py-6">
                <ServiceDrawing id={active} title={`${current.drawing}, ${current.name}`} />
              </div>
            </div>
            <ul className="grid gap-x-8 gap-y-2 border-t border-nevoa/20 pt-5 text-[15px] text-nevoa/85 md:grid-cols-3 lg:pt-4">
              {current.includes.map((item, i) => (
                <li
                  key={`${active}-${item}`}
                  className="svc-include flex gap-3"
                  style={{ "--i": i } as CSSProperties}
                >
                  <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-ceu" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Lista */}
          <div role="tablist" aria-orientation="vertical" aria-label="Serviços" className="flex flex-col">
            {services.map((s, i) => {
              const selected = s.id === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls="servico-desenho"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(s.id)}
                  onMouseEnter={() => finePointer && setActive(s.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="group relative block w-full border-t border-nevoa/20 py-6 text-left last:border-b lg:py-5"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-[-1px] left-0 h-px bg-ceu transition-[width] duration-500 ease-[var(--ease-out-strong)] ${
                      selected ? "w-full" : "w-0"
                    }`}
                  />
                  <span
                    className={`flex items-center justify-between gap-6 text-[clamp(1.5rem,1.2vw+1rem,2rem)] leading-tight tracking-[-0.02em] transition-colors duration-300 ${
                      selected ? "text-nevoa" : "text-nevoa/55 group-hover:text-nevoa/85"
                    }`}
                  >
                    {s.name}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className={`shrink-0 text-ceu transition-[transform,opacity] duration-300 ease-[var(--ease-out-strong)] ${
                        selected ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                      }`}
                    >
                      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[var(--ease-out-strong)] ${
                      selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block max-w-[40ch] pt-3 text-[15px] leading-relaxed text-nevoa/80">
                        {s.description}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
