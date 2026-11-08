import type { CSSProperties } from "react";
import { projects, testimonial } from "../data/content";
import type { Project } from "../data/content";
import { useInView } from "../lib/hooks";
import { Photo } from "./Photo";
import { ContactButton } from "./ui";

function Meta({ p }: { p: Project }) {
  return (
    <span className="font-mono text-xs tracking-[0.06em] text-ardosia uppercase tabular">
      {p.area} · {p.city}
    </span>
  );
}

function ProjectCard({
  project,
  aspect,
  onOpen,
  delay = 0,
  sizes,
  className = "",
}: {
  className?: string;
  project: Project;
  aspect: string;
  onOpen: (id: string) => void;
  delay?: number;
  sizes: string;
}) {
  const [ref, inView] = useInView<HTMLLIElement>();
  return (
    <li ref={ref} data-inview={inView} className={className}>
      <button
        type="button"
        onClick={() => onOpen(project.id)}
        data-cursor-label="Ver projeto"
        className="project-card group block w-full text-left"
      >
        <span
          className={`reveal-clip block overflow-hidden bg-linha-claro ${aspect}`}
          style={{ "--d": `${delay}ms` } as CSSProperties}
        >
          <Photo name={project.image} alt="" sizes={sizes} className="zoom h-full w-full object-cover" />
        </span>
        <span className="mt-5 block text-xl tracking-[-0.01em] text-grafite group-hover:underline md:text-2xl">
          {project.name}
        </span>
        <span className="mt-2 block">
          <Meta p={project} />
        </span>
        <span className="sr-only">. Ver detalhes</span>
      </button>
    </li>
  );
}

export function Projects({ onOpen }: { onOpen: (id: string) => void }) {
  const [featured, ...rest] = projects;
  const [featRef, featIn] = useInView<HTMLDivElement>();

  return (
    <section
      id="projetos"
      aria-labelledby="projetos-titulo"
      data-cursor-guides
      data-tone="light"
      className="relative z-10 scroll-mt-[72px] bg-pedra text-grafite lg:scroll-mt-[88px]"
    >
      <div className="mx-auto max-w-[1440px] px-5 pt-24 pb-28 md:px-10 md:pt-32 md:pb-40 lg:px-16">
        <h2
          id="projetos-titulo"
          className="text-[clamp(2.25rem,2.6vw+1rem,3.5rem)] leading-[1.05] font-light tracking-[-0.03em]"
        >
          Projetos selecionados
        </h2>

        {/* Destaque */}
        <div
          ref={featRef}
          data-inview={featIn}
          className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20"
        >
          <button
            type="button"
            onClick={() => onOpen(featured.id)}
            data-cursor-label="Ver projeto"
            className="project-card block w-full"
            aria-label={`${featured.name}. Ver detalhes`}
          >
            <span className="reveal-clip block aspect-[4/5] overflow-hidden bg-linha-claro">
              <span className="parallax block h-full w-full">
                <Photo
                  name={featured.image}
                  alt={featured.alt}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="zoom h-full w-full object-cover"
                />
              </span>
            </span>
          </button>

          <div className="flex flex-col justify-end gap-8">
            <div className="reveal-fade" style={{ "--d": "200ms" } as CSSProperties}>
              <h3 className="text-[clamp(2rem,1.6vw+1.25rem,2.5rem)] leading-tight font-light tracking-[-0.025em]">
                {featured.name}
              </h3>
              <p className="mt-3">
                <Meta p={featured} />
              </p>
            </div>
            <figure
              className="reveal-fade border-t border-linha-claro pt-7"
              style={{ "--d": "320ms" } as CSSProperties}
            >
              <blockquote className="text-[21px] leading-[1.45] font-light text-grafite italic md:text-[22px]">
                <p>“{testimonial.quote}”</p>
              </blockquote>
              <figcaption className="mt-4 text-sm text-ardosia">
                {testimonial.author}, {testimonial.role}
              </figcaption>
            </figure>
            <div className="reveal-fade" style={{ "--d": "420ms" } as CSSProperties}>
              <ContactButton tone="light" />
            </div>
          </div>
        </div>

        {/* Grade assimétrica */}
        <ul className="mt-20 grid gap-x-8 gap-y-16 md:mt-28 md:grid-cols-12 md:gap-y-24">
          <ProjectCard
              className="md:col-span-7"
              project={rest[0]}
              aspect="aspect-[748/540]"
              onOpen={onOpen}
              sizes="(min-width: 768px) 55vw, 100vw"
            />
          <ProjectCard
              className="md:col-span-5 md:pt-36"
              project={rest[1]}
              aspect="aspect-[532/400]"
              onOpen={onOpen}
              delay={120}
              sizes="(min-width: 768px) 38vw, 100vw"
            />
          <ProjectCard
              className="md:col-span-5"
              project={rest[2]}
              aspect="aspect-[532/400]"
              onOpen={onOpen}
              sizes="(min-width: 768px) 38vw, 100vw"
            />
          <ProjectCard
              className="md:col-span-7 md:pt-28"
              project={rest[3]}
              aspect="aspect-[748/540]"
              onOpen={onOpen}
              delay={120}
              sizes="(min-width: 768px) 55vw, 100vw"
            />
        </ul>
      </div>
    </section>
  );
}
