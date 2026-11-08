/**
 * Conteúdo do case fictício COTA Arquitetura.
 * Números, nomes, endereço e telefone são fictícios.
 */

/** Número de WhatsApp do escritório (DDI + DDD + número, só dígitos). Troque pelo real. */
export const WHATSAPP_NUMBER = "5511900000000";

export const CTA_LABEL = "Agendar conversa";

export type ImageName =
  | "casa-lagoa"
  | "cantareira"
  | "jardim-europa"
  | "higienopolis"
  | "campo-itu"
  | "campos-jordao"
  | "equipe-helena"
  | "equipe-rafael"
  | "equipe-marina"
  | "equipe-caio";

export interface Project {
  id: string;
  name: string;
  area: string;
  city: string;
  year: string;
  scope: string;
  description: string;
  image: ImageName;
  alt: string;
}

export const projects: Project[] = [
  {
    id: "cantareira",
    name: "Casa Cantareira",
    area: "420 m²",
    city: "Mairiporã, SP",
    year: "2024",
    scope: "Arquitetura e interiores",
    description:
      "Uma casa aberta para a mata, com uma marquise em madeira que filtra o sol da tarde e uma varanda que continua a sala.",
    image: "cantareira",
    alt: "Varanda coberta com marquise revestida em ripas de madeira, parede em ardósia, poltronas escuras e jardim denso ao redor.",
  },
  {
    id: "jardim-europa",
    name: "Residência Jardim Europa",
    area: "680 m²",
    city: "São Paulo, SP",
    year: "2023",
    scope: "Arquitetura, interiores e paisagismo",
    description:
      "Volumes em madeira, pedra e vidro organizados em torno de um pátio de entrada que leva luz a todos os ambientes.",
    image: "jardim-europa",
    alt: "Entrada de residência contemporânea com revestimento em ripas de madeira, pilar de pedra, marquise escura e caminho de mármore até a porta de vidro.",
  },
  {
    id: "higienopolis",
    name: "Apartamento Higienópolis",
    area: "310 m²",
    city: "São Paulo, SP",
    year: "2025",
    scope: "Interiores",
    description:
      "Reforma completa de um apartamento dos anos 60: paredes removidas, marcenaria sob medida e luz natural de ponta a ponta.",
    image: "higienopolis",
    alt: "Sala de estar clara com sofá cinza, mesa de centro baixa e luminária pendente.",
  },
  {
    id: "campo-itu",
    name: "Casa de Campo Itu",
    area: "540 m²",
    city: "Itu, SP",
    year: "2022",
    scope: "Arquitetura e paisagismo",
    description:
      "Telhados inclinados, pedra e madeira para uma casa de fim de semana pensada para receber a família inteira.",
    image: "campo-itu",
    alt: "Casa de campo com telhado inclinado, paredes de pedra e caminho de jardim florido.",
  },
  {
    id: "campos-jordao",
    name: "Refúgio Campos do Jordão",
    area: "380 m²",
    city: "Campos do Jordão, SP",
    year: "2023",
    scope: "Arquitetura",
    description:
      "Uma casa elevada sobre o terreno em declive, com varandas voltadas para a neblina da manhã e lareira no centro da planta.",
    image: "campos-jordao",
    alt: "Casa de madeira elevada em meio à mata, envolta em neblina.",
  },
  {
    id: "casa-lagoa",
    name: "Casa Lagoa",
    area: "460 m²",
    city: "Litoral Norte, BA",
    year: "2025",
    scope: "Arquitetura, interiores e paisagismo",
    description:
      "Uma casa entre a lagoa e o mar, com fachada em pedra natural e uma iluminação pensada para o fim de tarde.",
    image: "casa-lagoa",
    alt: "Casa contemporânea de dois pavimentos ao entardecer, com fachada em pedra iluminada e lagoa ao fundo.",
  },
];

export interface HeroVideo {
  /** Versão horizontal (desktop e tablet deitado) */
  landscape: string;
  /** Versão vertical (celular) */
  portrait: string;
}

/** Projeto do hero (vídeo de fundo com foto de capa). */
export const heroSlides: { project: Project; image: ImageName; alt: string; video?: HeroVideo }[] = [
  {
    project: projects[5],
    image: "casa-lagoa",
    alt: projects[5].alt,
    video: { landscape: "/videos/casa-lagoa-1080.mp4", portrait: "/videos/casa-lagoa-720-retrato.mp4" },
  },
];

export const testimonial = {
  quote:
    "Eles entenderam a casa antes de desenhar a casa. Hoje cada canto faz sentido para a nossa família.",
  author: "Juliana e Pedro Mazzini",
  role: "moradores da Casa Cantareira",
};

export const numbers = [
  { value: 12, label: "anos de escritório" },
  { value: 187, label: "projetos entregues" },
  { value: 46300, label: "m² projetados" },
  { value: 9, label: "prêmios de arquitetura" },
];

export type ServiceId = "arquitetura" | "interiores" | "paisagismo" | "obra";

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  includes: string[];
  drawing: string;
}

export const services: Service[] = [
  {
    id: "arquitetura",
    name: "Arquitetura residencial",
    description: "Casas desenhadas do terreno vazio ao habite-se, com cada decisão explicada antes de virar obra.",
    includes: ["Estudo de implantação e insolação", "Projeto legal e aprovação na prefeitura", "Projeto executivo completo"],
    drawing: "Elevação frontal",
  },
  {
    id: "interiores",
    name: "Interiores",
    description: "Marcenaria, iluminação e mobiliário pensados junto com a arquitetura, não depois dela.",
    includes: ["Layout e marcenaria sob medida", "Projeto luminotécnico", "Curadoria de materiais e mobiliário"],
    drawing: "Planta de layout da sala",
  },
  {
    id: "paisagismo",
    name: "Paisagismo",
    description: "Jardins que continuam a casa para fora e amadurecem junto com quem mora nela.",
    includes: ["Implantação do jardim", "Espécies adaptadas ao clima local", "Irrigação e iluminação externa"],
    drawing: "Implantação do jardim",
  },
  {
    id: "obra",
    name: "Acompanhamento de obra",
    description: "Visitas semanais e controle de cada detalhe executado, para que a casa saia como foi desenhada.",
    includes: ["Visitas semanais com relatório", "Compatibilização com fornecedores", "Checklist de entrega"],
    drawing: "Corte estrutural",
  },
];

export interface Member {
  name: string;
  role: string;
  bio: string;
  since: string;
  image: ImageName;
}

export const team: Member[] = [
  {
    name: "Helena Araújo",
    role: "Arquiteta fundadora",
    bio: "Fundou a COTA em 2014. Conduz a primeira conversa e assina todos os projetos.",
    since: "2014",
    image: "equipe-helena",
  },
  {
    name: "Rafael Tavares",
    role: "Arquiteto sócio",
    bio: "Responde pelo projeto executivo e é quem está na obra toda semana.",
    since: "2016",
    image: "equipe-rafael",
  },
  {
    name: "Marina Okamoto",
    role: "Interiores",
    bio: "Desenha a marcenaria e escolhe cada material junto com o cliente.",
    since: "2019",
    image: "equipe-marina",
  },
  {
    name: "Caio Brandão",
    role: "Paisagismo",
    bio: "Projeta jardins pensados para crescer junto com a casa.",
    since: "2021",
    image: "equipe-caio",
  },
];

/**
 * Pré-briefing em forma de frase: cada lacuna é uma escolha.
 * `label` é o texto que entra na frase (e na mensagem do WhatsApp).
 */
export const briefing = {
  tipo: {
    name: "Tipo de projeto",
    placeholder: "o quê?",
    options: ["uma casa", "o interior de um apartamento", "uma casa de campo", "um espaço corporativo"],
  },
  metragem: {
    name: "Metragem aproximada",
    placeholder: "quantos m²?",
    options: ["até 150 m²", "150 a 300 m²", "300 a 600 m²", "mais de 600 m²"],
  },
  prazo: {
    name: "Quando quer começar",
    placeholder: "quando?",
    options: ["ainda este ano", "no próximo ano", "quando for o momento certo"],
  },
} as const;

export const contact = {
  address: "Rua Fradique Coutinho, 1200 · Pinheiros, São Paulo",
  instagram: "@cota.arq",
  hours: "Seg a sex, 9h às 18h",
};
