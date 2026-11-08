import { useEffect, useRef, useState } from "react";
import { ContactButton } from "./ui";

const links = [
  { href: "#projetos", label: "Projetos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#equipe", label: "Equipe" },
];

export function Logo() {
  return (
    <a href="#topo" className="flex items-baseline gap-3 text-nevoa relative before:absolute before:inset-x-0 before:-inset-y-3 before:content-['']">
      <span className="text-[22px] leading-none font-medium tracking-[0.18em]">COTA</span>
      <span className="sr-only"> </span>
      <span className="font-mono text-[11px] tracking-[0.08em] text-nevoa/75 uppercase">Arquitetura</span>
      <span className="sr-only">, voltar ao topo</span>
    </a>
  );
}

export function Header({ solid }: { solid: boolean }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`on-dark fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid || open
          ? "border-linha-escuro bg-noite/90 backdrop-blur-md"
          : "border-nevoa/20 bg-transparent"
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only bg-ceu px-4 py-2 text-noite focus:not-sr-only focus:absolute focus:top-2 focus:left-4"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:h-[88px] lg:px-16">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[15px] text-nevoa/85 transition-colors duration-200 hover:text-nevoa hover:underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <ContactButton tone="dark" />
        </div>

        <button
          ref={menuButton}
          type="button"
          className="flex min-h-11 items-center gap-3 px-1 text-[15px] text-nevoa lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
            />
          </span>
        </button>
      </div>

      <div
        id="menu-mobile"
        ref={panel}
        hidden={!open}
        className="no-scrollbar h-[calc(100dvh-72px)] overflow-y-auto border-t border-linha-escuro bg-noite px-5 pt-10 pb-12 md:px-10 lg:hidden"
      >
        <nav aria-label="Menu">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-linha-escuro">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-5 text-[32px] font-light tracking-[-0.02em] text-nevoa"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10" onClick={() => setOpen(false)}>
          <ContactButton tone="dark" className="w-full justify-between" />
        </div>
      </div>
    </header>
  );
}
