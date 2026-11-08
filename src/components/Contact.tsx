import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { briefing, contact } from "../data/content";
import { briefingMessage, whatsappUrl } from "../lib/whatsapp";
import type { BriefingAnswers } from "../lib/whatsapp";
import { Button, WhatsAppIcon } from "./ui";

/** Ordem das perguntas: cada uma é uma lacuna da frase. */
const STEPS = [
  { key: "tipo", question: "O que você quer projetar?", placeholder: briefing.tipo.placeholder, required: true },
  { key: "metragem", question: "Qual a metragem aproximada?", placeholder: briefing.metragem.placeholder, required: false },
  { key: "cidade", question: "Em qual cidade fica o projeto?", placeholder: "qual cidade?", required: false },
  { key: "prazo", question: "Quando você gostaria de começar?", placeholder: briefing.prazo.placeholder, required: false },
] as const;

type StepKey = (typeof STEPS)[number]["key"];
const DONE = STEPS.length;

const OPTIONS: Record<Exclude<StepKey, "cidade">, readonly string[]> = {
  tipo: briefing.tipo.options,
  metragem: briefing.metragem.options,
  prazo: briefing.prazo.options,
};
const CITY_SUGGESTIONS = ["São Paulo", "Alphaville", "Campinas", "Interior de SP", "Litoral de SP"];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`ml-2 shrink-0 translate-y-[0.04em] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="m3 5 4 4 4-4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Uma lacuna da frase. É um botão: abre a pergunta correspondente logo abaixo. */
function Blank({
  value,
  placeholder,
  label,
  active,
  invalid,
  onOpen,
  trayId,
}: {
  value?: string;
  placeholder: string;
  label: string;
  active: boolean;
  invalid?: boolean;
  onOpen: () => void;
  trayId: string;
}) {
  const filled = !!value?.trim();
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={active}
      aria-controls={trayId}
      className={`blank ${filled ? "is-filled" : ""} ${active ? "is-active" : ""} ${invalid ? "is-invalid" : ""}`}
    >
      <span className="blank-text">{filled ? value : placeholder}</span>
      <span className="sr-only">{`, ${label}${filled ? "" : " (não preenchido)"}. Alterar`}</span>
      <Chevron open={active} />
    </button>
  );
}

function Option({ label, selected, onPick }: { label: string; selected: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      className={`btn tray-option flex min-h-12 items-center gap-2 border px-5 text-left text-[16px] ${
        selected
          ? "border-aco bg-aco text-nevoa"
          : "border-linha-claro bg-white/60 text-grafite hover:border-aco hover:text-aco"
      }`}
    >
      {selected && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
          <path d="m2.5 7.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
      {label}
    </button>
  );
}

export function Contact() {
  const [answers, setAnswers] = useState<BriefingAnswers>({});
  const [step, setStep] = useState(0);
  const [cityDraft, setCityDraft] = useState("");
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState("");
  const tray = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const trayId = useId();
  const errorId = useId();
  const cityId = useId();

  /** Ao trocar de pergunta por interação, leva o foco para a primeira opção. */
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const first = tray.current?.querySelector<HTMLElement>("input, .tray-option, [data-primary]");
    first?.focus({ preventScroll: true });
    tray.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [step]);

  const nextEmpty = (from: number, a: BriefingAnswers) => {
    for (let i = from; i < STEPS.length; i++) if (!a[STEPS[i].key]?.trim()) return i;
    return DONE;
  };

  const go = (to: number) => {
    moved.current = true;
    if (STEPS[to]?.key === "cidade") setCityDraft(answers.cidade ?? "");
    setStep(to);
  };

  const answer = (key: StepKey, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStatus("");
    if (key === "tipo") setError(undefined);
    const i = STEPS.findIndex((s) => s.key === key);
    go(nextEmpty(i + 1, next));
  };

  const skip = () => go(step + 1 >= STEPS.length ? DONE : step + 1);

  const reset = () => {
    setAnswers({});
    setCityDraft("");
    setError(undefined);
    setStatus("");
    go(0);
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!answers.tipo) {
      setError("Comece escolhendo o que você quer projetar.");
      go(0);
      return;
    }
    const win = window.open(whatsappUrl(briefingMessage(answers)), "_blank");
    if (win) win.opener = null;
    setStatus(
      win
        ? "Pronto. O WhatsApp abriu em outra aba com a sua mensagem."
        : "O navegador bloqueou a nova aba. Libere pop-ups para este site e tente de novo.",
    );
  };

  const saveCity = () => answer("cidade", cityDraft.trim());
  const onCityKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCity();
    }
  };

  const filled = STEPS.filter((s) => answers[s.key]?.trim()).length;
  const current = STEPS[step];

  const blank = (i: number) => {
    const s = STEPS[i];
    return (
      <Blank
        value={answers[s.key]}
        placeholder={s.placeholder}
        label={s.question}
        active={step === i}
        invalid={s.key === "tipo" && !!error}
        onOpen={() => go(i)}
        trayId={trayId}
      />
    );
  };

  return (
    <>
      <section
        id="contato"
        aria-labelledby="contato-titulo"
        data-tone="light"
        className="relative z-10 scroll-mt-[72px] bg-nevoa text-grafite lg:scroll-mt-[88px]"
      >
        <div className="mx-auto max-w-[1440px] px-5 pt-24 pb-24 md:px-10 md:pt-36 md:pb-32 lg:px-16">
          <h2 id="contato-titulo" className="text-xl text-ardosia md:text-2xl">
            Vamos abrir espaço para o seu projeto?
          </h2>
          <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-ardosia">
            Responda quatro perguntas rápidas. Cada resposta completa a frase abaixo, que vira a sua mensagem no
            WhatsApp.
          </p>

          <form onSubmit={submit} noValidate className="mt-12 md:mt-16">
            {/* A frase, sempre visível: é a prévia da mensagem */}
            <p className="max-w-[24ch] text-[clamp(1.875rem,3.6vw+0.5rem,4rem)] leading-[1.38] font-light tracking-[-0.03em] text-grafite md:max-w-[30ch]">
              Olá, COTA. Quero projetar {blank(0)} de {blank(1)} em {blank(2)}, para começar {blank(3)}.
            </p>

            {/* Pergunta atual com as opções visíveis */}
            <div
              ref={tray}
              id={trayId}
              role="group"
              aria-labelledby={`${trayId}-q`}
              className="mt-10 border border-linha-claro bg-white/50 p-5 md:mt-12 md:p-8"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.key}
                      className={`h-1 w-8 transition-colors duration-300 md:w-10 ${
                        answers[s.key]?.trim() ? "bg-aco" : i === step ? "bg-aco/35" : "bg-linha-claro"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-ardosia tabular" aria-live="polite">
                  {step === DONE ? `${filled} de 4 respondidas` : `Pergunta ${step + 1} de 4`}
                </span>
              </div>

              <div key={step} className="tray-step mt-6">
                {step === DONE ? (
                  <>
                    <p id={`${trayId}-q`} className="text-xl text-grafite md:text-2xl">
                      Tudo certo. Confira a frase acima e envie.
                    </p>
                    <p className="mt-2 text-[15px] text-ardosia">
                      Quer mudar algo? Toque na palavra em azul que deseja trocar.
                    </p>
                  </>
                ) : (
                  <>
                    <p id={`${trayId}-q`} className="text-xl text-grafite md:text-2xl">
                      {current.question}
                      <span className="ml-3 align-middle text-sm text-ardosia">
                        {current.required ? "Obrigatória" : "Opcional"}
                      </span>
                    </p>

                    {current.key === "cidade" ? (
                      <div className="mt-5">
                        <label htmlFor={cityId} className="sr-only">
                          Cidade do projeto
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            id={cityId}
                            type="text"
                            autoComplete="address-level2"
                            value={cityDraft}
                            onChange={(e) => setCityDraft(e.target.value)}
                            onKeyDown={onCityKey}
                            placeholder="Digite a cidade"
                            className="h-12 w-full max-w-[420px] border border-linha-claro bg-white px-5 text-[16px] text-grafite placeholder:text-ardosia/80 focus:border-aco focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-aco"
                          />
                          <Button type="button" tone="light" onClick={saveCity} disabled={!cityDraft.trim()} className="disabled:opacity-50">
                            Continuar
                          </Button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {CITY_SUGGESTIONS.map((c) => (
                            <Option key={c} label={c} selected={answers.cidade === c} onPick={() => answer("cidade", c)} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 flex flex-wrap gap-2.5">
                        {OPTIONS[current.key].map((o) => (
                          <Option key={o} label={o} selected={answers[current.key] === o} onPick={() => answer(current.key, o)} />
                        ))}
                      </div>
                    )}

                    {current.key === "tipo" && error && (
                      <p id={errorId} role="alert" className="mt-4 text-[15px] text-aco">
                        {error}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={() => go(step - 1)}
                          className="min-h-11 text-ardosia underline underline-offset-4 hover:text-grafite"
                        >
                          Voltar
                        </button>
                      )}
                      {!current.required && (
                        <button
                          type="button"
                          onClick={skip}
                          className="min-h-11 text-ardosia underline underline-offset-4 hover:text-grafite"
                        >
                          Pular esta pergunta
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <p className="text-[15px] leading-relaxed text-ardosia" aria-live="polite">
                {status || "Você revisa tudo no WhatsApp antes de enviar."}
              </p>
              <div className="flex items-center gap-6">
                {filled > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="min-h-11 text-[15px] text-ardosia underline underline-offset-4 hover:text-grafite"
                  >
                    Recomeçar
                  </button>
                )}
                <Button
                  type="submit"
                  tone="light"
                  data-primary
                  icon={<WhatsAppIcon className="size-5" />}
                  aria-describedby={error ? errorId : undefined}
                  className={step === DONE ? "send-ready" : ""}
                >
                  Enviar pelo WhatsApp
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <footer className="on-dark relative z-10 bg-noite text-nevoa">
        <div className="mx-auto max-w-[1440px] px-5 pt-16 md:px-10 lg:px-16">
          <div className="grid gap-4 text-sm text-nevoa/75 md:grid-cols-2 lg:flex lg:justify-between">
            <address className="not-italic">{contact.address}</address>
            <span>{contact.instagram}</span>
            <span>{contact.hours}</span>
            <span>
              Case fictício de portfólio ·{" "}
              <a
                href="https://github.com/Sabrina-vlobo/cota-arquitetura"
                target="_blank"
                rel="noreferrer"
                className="relative text-nevoa underline decoration-nevoa/40 underline-offset-4 before:absolute before:inset-x-0 before:-inset-y-3 before:content-[''] hover:decoration-nevoa"
              >
                ver o código
              </a>
            </span>
          </div>
          <div aria-hidden="true" className="relative mt-10 h-[22vw] max-h-[250px] overflow-hidden select-none">
            <span className="wordmark absolute top-[-0.06em] -left-[0.04em] text-[30.5vw] leading-none font-light tracking-[-0.04em] lg:text-[min(30.5vw,440px)]">
              COTA
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
