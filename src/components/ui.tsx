import type { ButtonHTMLAttributes, ReactNode, SVGProps } from "react";
import { siWhatsapp } from "simple-icons";
import { CTA_LABEL } from "../data/content";
import { goToContact } from "../lib/whatsapp";

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={siWhatsapp.path} />
    </svg>
  );
}

type Tone = "light" | "dark";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** "light" = em fundo claro (Aço), "dark" = em fundo escuro (Céu) */
  tone?: Tone;
  children?: ReactNode;
  icon?: ReactNode;
}

export function Button({ tone = "light", children = CTA_LABEL, icon, className = "", ...rest }: ButtonProps) {
  const toneClass =
    tone === "light"
      ? "bg-aco text-nevoa hover:bg-aco-escuro"
      : "bg-ceu text-noite hover:bg-ceu-claro";
  return (
    <button
      type="button"
      data-cursor-label={typeof children === "string" ? children : undefined}
      className={`btn inline-flex min-h-12 items-center gap-3 px-6 py-3.5 text-[15px] font-medium whitespace-nowrap ${toneClass} ${className}`}
      {...rest}
    >
      {children}
      {icon ?? <ArrowRight className="btn-arrow" />}
    </button>
  );
}

/** O CTA único do site: leva ao pré-briefing. */
export function ContactButton(props: Omit<ButtonProps, "onClick">) {
  return <Button onClick={goToContact} {...props} />;
}
