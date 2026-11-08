import { useLayoutEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { ServiceId } from "../data/content";

/** Traço que se desenha. O comprimento real é medido no navegador (ver ServiceDrawing). */
function L({ d, i, faint = false, w = 1.2 }: { d: string; i: number; faint?: boolean; w?: number }) {
  return (
    <path
      d={d}
      data-draw
      strokeWidth={w}
      opacity={faint ? 0.45 : 1}
      style={{ "--i": i } as CSSProperties}
    />
  );
}

function Label({ x, y, children, i, anchor = "middle" }: { x: number; y: number; children: ReactNode; i: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="dim-label fill-current font-mono text-[11px] tracking-[0.06em]"
      stroke="none"
      style={{ "--i": i } as CSSProperties}
    >
      {children}
    </text>
  );
}

/** Cota horizontal com marcas nas pontas */
function HDim({ x1, x2, y, label, i }: { x1: number; x2: number; y: number; label: string; i: number }) {
  return (
    <>
      <L d={`M${x1} ${y}H${x2}`} i={i} />
      <L d={`M${x1} ${y - 8}V${y + 8}`} i={i} />
      <L d={`M${x2} ${y - 8}V${y + 8}`} i={i + 2} />
      <Label x={(x1 + x2) / 2} y={y + 22} i={i + 3}>
        {label}
      </Label>
    </>
  );
}

function VDim({ x, y1, y2, label, i }: { x: number; y1: number; y2: number; label: string; i: number }) {
  return (
    <>
      <L d={`M${x} ${y2}V${y1}`} i={i} />
      <L d={`M${x - 8} ${y2}H${x + 8}`} i={i} />
      <L d={`M${x - 8} ${y1}H${x + 8}`} i={i + 2} />
      <Label x={x + 14} y={(y1 + y2) / 2 + 4} i={i + 3} anchor="start">
        {label}
      </Label>
    </>
  );
}

const elevacao = (
  <>
    <L d="M0 300H560" i={0} w={1.8} />
    <L d="M60 300V150H320V300" i={2} w={1.5} />
    <L d="M180 160V60H500V160H180" i={4} w={1.5} />
    <L d="M200 140V80H480V140H200" i={6} />
    <L d="M270 80V140" i={8} />
    <L d="M340 80V140" i={9} />
    <L d="M410 80V140" i={10} />
    <L d="M80 300V200H230V300" i={8} />
    <L d="M117 200V300" i={11} />
    <L d="M155 200V300" i={12} />
    <L d="M192 200V300" i={13} />
    <L d="M260 300V230H300V300" i={11} />
    <L d="M320 300V160H500V300" i={12} faint />
    <HDim x1={60} x2={500} y={340} label="12,40 m" i={15} />
    <VDim x={530} y1={60} y2={300} label="7,20 m" i={16} />
  </>
);

const interiores = (
  <>
    <L d="M240 340H40V40H520V340H300" i={0} w={1.8} />
    <L d="M140 40V48H300V40" i={2} />
    <L d="M240 340V282" i={4} />
    <L d="M240 282A58 58 0 0 1 298 340" i={5} faint />
    <L d="M110 115H290V215H110Z" i={4} faint />
    <L d="M145 145H255V185H145Z" i={6} />
    <L d="M90 232H310V292H90Z" i={6} />
    <L d="M90 278H310" i={8} />
    <L d="M163 232V278M236 232V278" i={9} />
    <L d="M375 95H485V255H375Z" i={7} />
    <L d="M355 110H369V140H355ZM355 160H369V190H355ZM355 210H369V240H355Z" i={10} />
    <L d="M491 110H505V140H491ZM491 160H505V190H491ZM491 210H505V240H491Z" i={11} />
    <L d="M60 60H96V96H60Z" i={9} faint />
    <HDim x1={40} x2={520} y={362} label="9,60 m" i={13} />
  </>
);

const tree = (cx: number, cy: number, r: number, i: number) => (
  <>
    <L d={`M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}`} i={i} />
    <L d={`M${cx - 4} ${cy}H${cx + 4}M${cx} ${cy - 4}V${cy + 4}`} i={i + 1} faint />
  </>
);

const paisagismo = (
  <>
    <L d="M30 30H530V350H30Z" i={0} faint />
    <L d="M60 60H300V180H200V240H60Z" i={1} w={1.5} />
    <L d="M340 70H490V130H340Z" i={3} />
    <L d="M352 82H478V118H352Z" i={5} faint />
    <L d="M200 240C228 282 262 306 296 350" i={4} />
    <L d="M222 236C250 278 284 304 320 350" i={5} />
    <L d="M300 180C366 168 430 206 530 184" i={6} faint />
    {tree(398, 236, 34, 6)}
    {tree(474, 284, 24, 8)}
    {tree(104, 296, 28, 7)}
    {tree(372, 318, 16, 9)}
    {tree(470, 196, 14, 10)}
    <L d="M506 336L516 306L526 336" i={11} />
    <Label x={516} y={298} i={12}>
      N
    </Label>
    <Label x={180} y={124} i={12}>
      CASA
    </Label>
    <Label x={415} y={104} i={12}>
      PISCINA
    </Label>
  </>
);

const obra = (
  <>
    <L d="M20 320H540" i={0} w={1.5} />
    <L d="M70 320H110V344H70ZM270 320H310V344H270ZM470 320H510V344H470Z" i={2} faint />
    <L d="M90 320V80" i={3} w={1.5} />
    <L d="M290 320V80" i={4} w={1.5} />
    <L d="M490 320V80" i={5} w={1.5} />
    <L d="M60 210H520M60 220H520" i={6} />
    <L d="M60 80H520M60 90H520" i={8} />
    <L d="M518 320V64M540 320V64" i={9} faint />
    <L d="M518 320L540 280L518 240L540 200L518 160L540 120L518 80" i={10} faint />
    <L d="M32 312H48L40 320ZM32 202H48L40 210ZM32 72H48L40 80Z" i={11} />
    <Label x={52} y={316} i={12} anchor="start">
      +0,00
    </Label>
    <Label x={52} y={206} i={13} anchor="start">
      +3,20
    </Label>
    <Label x={52} y={76} i={14} anchor="start">
      +6,40
    </Label>
    <HDim x1={90} x2={490} y={364} label="2 vãos de 6,00 m" i={14} />
  </>
);

const drawings: Record<ServiceId, ReactNode> = {
  arquitetura: elevacao,
  interiores,
  paisagismo,
  obra,
};

export function ServiceDrawing({ id, title }: { id: ServiceId; title: string }) {
  const svg = useRef<SVGSVGElement>(null);

  // Mede cada traço no seu comprimento real, para a animação de desenho
  // cobrir a linha inteira sem falhas em qualquer tamanho de tela.
  useLayoutEffect(() => {
    const el = svg.current;
    if (!el) return;
    el.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p) => {
      const len = Math.ceil(p.getTotalLength()) + 2;
      p.style.setProperty("--len", String(len));
    });
    el.dataset.measured = "true";
  }, [id]);

  return (
    <svg
      ref={svg}
      viewBox="-10 0 600 390"
      role="img"
      aria-label={`Desenho técnico: ${title}`}
      className="drawing h-auto w-full text-ceu-claro lg:h-full"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
    >
      {drawings[id]}
    </svg>
  );
}
