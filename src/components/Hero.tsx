import { forwardRef, useCallback, useState } from "react";
import type { CSSProperties } from "react";
import { heroSlides } from "../data/content";
import { HeroVideo, VideoToggle } from "./HeroVideo";
import { Photo } from "./Photo";
import { ContactButton } from "./ui";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Uma cota de desenho técnico: linha com marcas nas pontas e a medida. */
function Cota({ label, className, delay }: { label: string; className: string; delay: number }) {
  return (
    <div className={`intro-cota pointer-events-none absolute flex items-center ${className}`} style={d(delay)} aria-hidden="true">
      <span className="h-3 w-px bg-ceu" />
      <span className="intro-line-x relative h-px flex-1 bg-ceu" style={d(delay)} />
      <span className="h-3 w-px bg-ceu" />
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.06em] text-ceu tabular">
        {label}
      </span>
    </div>
  );
}

interface HeroProps {
  onOpenProject: (id: string) => void;
  /** Falso quando a página já cobriu o hero (pausa o vídeo). */
  visible?: boolean;
}

export const Hero = forwardRef<HTMLElement, HeroProps>(function Hero({ onOpenProject, visible = true }, ref) {
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const onVideoReady = useCallback((r: boolean) => setVideoReady(r), []);
  const slide = heroSlides[0];

  return (
    <section
      ref={ref}
      id="topo"
      aria-label="Apresentação"
      data-cursor-guides
      className="on-dark sticky top-0 z-0 flex h-[100dvh] min-h-[560px] flex-col overflow-hidden bg-noite text-nevoa"
    >
      {/* Capa (aparece de imediato) e vídeo por cima */}
      <div className="absolute inset-0">
        <Photo name={slide.image} alt={slide.alt} sizes="100vw" priority className="intro-photo h-full w-full object-cover" />
        {slide.video && (
          <HeroVideo video={slide.video} active={visible} paused={videoPaused} onReady={onVideoReady} />
        )}
      </div>

      {/* Sombras para leitura */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(15_26_43/0.45)_0%,rgb(15_26_43/0.05)_40%,rgb(15_26_43/0.85)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgb(15_26_43/0.8)_0%,rgb(15_26_43/0)_62%)]"
      />

      {/* Escurece conforme a página sobe por cima do hero */}
      <div aria-hidden="true" className="hero-dim pointer-events-none absolute inset-0 z-10 bg-noite opacity-0" />

      {/* Grade de prancha */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <span className="intro-line-y absolute top-0 left-[24.4%] h-[48%] w-px bg-nevoa/20" style={d(150)} />
        <span className="intro-line-y absolute top-0 left-[75.5%] h-full w-px bg-nevoa/20" style={d(300)} />
      </div>

      {/* Cotas: o espaço medido antes de existir */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <Cota label="36,80 m" className="right-[calc(24.5%+24px)] bottom-7 left-16" delay={500} />
        <div className="intro-cota absolute top-[120px] right-7 bottom-[300px] flex flex-col items-center" style={d(700)}>
          <span className="h-px w-3 bg-ceu" />
          <span className="intro-line-y w-px flex-1 bg-ceu" style={d(700)} />
          <span className="h-px w-3 bg-ceu" />
          <span className="absolute top-1/2 right-4 font-mono text-[11px] tracking-[0.06em] whitespace-nowrap text-ceu tabular">
            9,60 m
          </span>
        </div>
      </div>

      <div
        id="conteudo"
        className="hero-sink relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pt-32 pb-14 md:px-10 md:pb-20 lg:px-16 lg:pb-[88px]"
      >
        <h1 className="text-[clamp(2.75rem,5.6vw+0.5rem,5.5rem)] leading-[1.02] font-light tracking-[-0.035em]">
          <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span className="intro-rise block" style={d(250)}>
              Espaços que respiram
            </span>
          </span>
          <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span className="intro-rise block" style={d(340)}>
              com você.
            </span>
          </span>
        </h1>
        <p className="intro-fade mt-7 max-w-[30rem] text-[17px] leading-[1.55] text-nevoa/88 md:text-lg" style={d(520)}>
          Arquitetura e interiores sob medida para casas de alto padrão, do primeiro traço à entrega da obra.
        </p>
        <div className="intro-fade mt-9" style={d(620)}>
          <ContactButton tone="dark" />
        </div>
      </div>

      {/* Projeto do vídeo */}
      <div
        className="intro-blur absolute right-5 bottom-14 hidden items-center gap-4 border border-nevoa/22 bg-noite/50 p-2 pl-6 backdrop-blur-xl md:flex lg:bottom-[88px]"
        style={d(900)}
      >
        <button
          type="button"
          onClick={() => onOpenProject(slide.project.id)}
          data-cursor-label="Ver projeto"
          className="group py-3 text-left"
        >
          <span className="block text-lg leading-tight tracking-[-0.01em] text-nevoa group-hover:underline">
            {slide.project.name}
          </span>
          <span className="mt-1.5 block font-mono text-[11px] tracking-[0.06em] text-ceu uppercase">
            {slide.project.area} · {slide.project.city}
          </span>
        </button>
        {videoReady && <VideoToggle paused={videoPaused} onToggle={() => setVideoPaused((p) => !p)} />}
      </div>
      {videoReady && (
        <div className="absolute top-[92px] right-5 z-20 md:hidden">
          <VideoToggle paused={videoPaused} onToggle={() => setVideoPaused((p) => !p)} />
        </div>
      )}
    </section>
  );
});
