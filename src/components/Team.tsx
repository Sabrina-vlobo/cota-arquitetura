import { useState } from "react";
import { team } from "../data/content";
import { useFinePointer, useInView } from "../lib/hooks";
import { Photo } from "./Photo";

/**
 * Equipe como índice: nomes grandes em lista. No desktop, o retrato de quem está
 * em foco aparece num quadro fixo à direita (troca por recorte). No celular,
 * cada nome vem com o próprio retrato.
 */
export function Team() {
  const [active, setActive] = useState(0);
  const fine = useFinePointer();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      id="equipe"
      aria-labelledby="equipe-titulo"
      className="on-dark relative z-10 scroll-mt-[72px] bg-noite text-nevoa lg:scroll-mt-[88px]"
    >
      <div ref={ref} data-inview={inView} className="mx-auto max-w-[1440px] px-5 pt-24 pb-24 md:px-10 md:pt-32 md:pb-32 lg:px-16">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-20">
          <div>
            <h2
              id="equipe-titulo"
              className="text-[clamp(2.25rem,2.6vw+1rem,3.5rem)] leading-[1.05] font-light tracking-[-0.03em]"
            >
              Quem desenha com você
            </h2>
            <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-nevoa/75">
              Uma equipe pequena, por escolha. Quem atende você é quem desenha.
            </p>

            <ol className="mt-14 border-b border-linha-escuro md:mt-16">
              {team.map((m, i) => {
                const on = i === active;
                return (
                  <li key={m.name} className="border-t border-linha-escuro">
                    <button
                      type="button"
                      onMouseEnter={() => fine && setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      className="group grid w-full grid-cols-[88px_minmax(0,1fr)] items-center gap-5 py-6 text-left md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 md:py-8"
                    >
                      {/* Retrato inline (celular e tablet) */}
                      <span className="block aspect-[3/4] overflow-hidden bg-linha-escuro md:hidden">
                        <Photo
                          name={m.image}
                          alt={`Retrato de ${m.name}`}
                          sizes="88px"
                          className="portrait-sm h-full w-full object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-[clamp(1.75rem,3.2vw+0.5rem,4rem)] leading-[1.02] font-light tracking-[-0.035em] transition-[color,transform] duration-500 ease-[var(--ease-out-strong)] ${
                            on ? "text-nevoa lg:translate-x-3" : "text-nevoa md:text-nevoa/40 md:group-hover:text-nevoa/70"
                          }`}
                        >
                          {m.name}
                        </span>
                        <span
                          className={`mt-2 block max-w-[46ch] text-[15px] leading-relaxed transition-colors duration-500 md:hidden ${
                            "text-nevoa/80"
                          }`}
                        >
                          {m.bio}
                        </span>
                      </span>
                      <span
                        className={`col-start-2 font-mono text-[11px] tracking-[0.06em] uppercase transition-colors duration-500 md:col-start-auto md:text-right ${
                          on ? "text-ceu" : "text-ceu md:text-nevoa/50"
                        }`}
                      >
                        {m.role}
                        <span className="mt-1 block text-nevoa/50 tabular">Desde {m.since}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Quadro do retrato (desktop) */}
          <div className="hidden md:block">
            <div className="sticky top-[120px]">
              <div className="relative aspect-[3/4] overflow-hidden bg-linha-escuro">
                {team.map((m, i) => (
                  <div
                    key={m.name}
                    aria-hidden={i !== active}
                    className="team-frame absolute inset-0"
                    data-active={i === active}
                  >
                    <Photo
                      name={m.image}
                      alt={i === active ? `Retrato de ${m.name}` : ""}
                      sizes="(min-width: 1024px) 440px, 40vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                {/* Cotas do quadro */}
                <span aria-hidden="true" className="absolute inset-x-4 bottom-4 flex items-center text-ceu">
                  <span className="h-2.5 w-px bg-current" />
                  <span className="h-px flex-1 bg-current opacity-70" />
                  <span className="h-2.5 w-px bg-current" />
                </span>
              </div>
              <p className="mt-6 min-h-[3.2em] max-w-[40ch] text-[17px] leading-relaxed text-nevoa/80" aria-live="polite">
                {team[active].bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
