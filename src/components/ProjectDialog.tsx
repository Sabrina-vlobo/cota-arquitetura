import { useEffect, useRef } from "react";
import { projects } from "../data/content";
import { goToContact } from "../lib/whatsapp";
import { Photo } from "./Photo";
import { Button, CloseIcon } from "./ui";

export function ProjectDialog({ projectId, onClose }: { projectId: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const project = projects.find((p) => p.id === projectId) ?? null;
  const lastProject = useRef(project);
  if (project) lastProject.current = project;
  const p = project ?? lastProject.current;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="dialog-titulo"
      className="project-dialog m-auto max-h-[92dvh] w-[min(1120px,calc(100vw-24px))] max-w-none overflow-y-auto bg-nevoa p-0 text-grafite backdrop:bg-transparent"
    >
      {p && (
        <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="aspect-[4/3] bg-linha-claro lg:aspect-auto lg:min-h-[620px]">
            <Photo name={p.image} alt={p.alt} sizes="(min-width: 1024px) 60vw, 100vw" className="h-full w-full object-cover" />
          </div>
          <div className="relative flex flex-col gap-8 p-6 md:p-10">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="btn absolute top-3 right-3 grid size-11 place-items-center text-grafite hover:bg-linha-claro"
            >
              <CloseIcon />
            </button>
            <div className="pr-10">
              <h2 id="dialog-titulo" className="text-[clamp(1.75rem,1.5vw+1.25rem,2.5rem)] leading-tight font-light tracking-[-0.025em]">
                {p.name}
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-ardosia">{p.description}</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-linha-claro pt-6">
              {[
                ["Área", p.area],
                ["Local", p.city],
                ["Ano", p.year],
                ["Escopo", p.scope],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[11px] tracking-[0.06em] text-ardosia uppercase">{k}</dt>
                  <dd className="mt-1.5 text-[15px] text-grafite tabular">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto">
              <Button
                tone="light"
                onClick={() => {
                  onClose();
                  window.setTimeout(goToContact, 180);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
