import { WHATSAPP_NUMBER } from "../data/content";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface BriefingAnswers {
  tipo?: string;
  metragem?: string;
  cidade?: string;
  prazo?: string;
}

/** Monta a frase do pré-briefing com o que foi preenchido. */
export function briefingSentence(a: BriefingAnswers) {
  let text = `Quero projetar ${a.tipo ?? "um projeto"}`;
  if (a.metragem) text += ` de ${a.metragem}`;
  if (a.cidade?.trim()) text += ` em ${a.cidade.trim()}`;
  if (a.prazo) text += `, para começar ${a.prazo}`;
  return `${text}.`;
}

export function briefingMessage(a: BriefingAnswers) {
  return `Olá, COTA! Vim pelo site. ${briefingSentence(a)} Podemos agendar uma conversa?`;
}

export const genericMessage = "Olá, COTA! Vim pelo site e gostaria de conversar sobre um projeto.";

/** Rola até o pré-briefing e coloca o foco na primeira pergunta. */
export function goToContact() {
  const el = document.getElementById("contato");
  if (!el) return;
  el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  window.setTimeout(() => {
    el.querySelector<HTMLElement>("select, input")?.focus({ preventScroll: true });
  }, 700);
}
