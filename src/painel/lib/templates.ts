import type { KanbanStatus, StageStatus } from "@/painel/types/database";

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  initialKanban: KanbanStatus;
  stages: {
    name: string;
    weight: number;
    typicalDurationDays: number;
    estimatedCost: number;
    initialStatus: StageStatus;
  }[];
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    id: "georreferenciamento",
    name: "Georreferenciamento INCRA",
    description: "Levantamento GNSS, memorial descritivo e protocolo INCRA.",
    initialKanban: "levantamento",
    stages: [
      { name: "Análise documental", weight: 10, typicalDurationDays: 3, estimatedCost: 800, initialStatus: "in_progress" },
      { name: "Levantamento de campo", weight: 35, typicalDurationDays: 5, estimatedCost: 4500, initialStatus: "pending" },
      { name: "Processamento e planta", weight: 25, typicalDurationDays: 7, estimatedCost: 2200, initialStatus: "pending" },
      { name: "Protocolo INCRA", weight: 20, typicalDurationDays: 30, estimatedCost: 600, initialStatus: "pending" },
      { name: "Entrega e registro", weight: 10, typicalDurationDays: 15, estimatedCost: 400, initialStatus: "pending" },
    ],
  },
  {
    id: "desmembramento",
    name: "Desmembramento / Unificação",
    description: "Divisão ou remembramento com documentação cartorial.",
    initialKanban: "analise",
    stages: [
      { name: "Viabilidade jurídica", weight: 15, typicalDurationDays: 5, estimatedCost: 1200, initialStatus: "in_progress" },
      { name: "Levantamento topográfico", weight: 30, typicalDurationDays: 4, estimatedCost: 3800, initialStatus: "pending" },
      { name: "Memorial e planta", weight: 25, typicalDurationDays: 10, estimatedCost: 2000, initialStatus: "pending" },
      { name: "Cartório", weight: 30, typicalDurationDays: 45, estimatedCost: 1500, initialStatus: "pending" },
    ],
  },
  {
    id: "regularizacao",
    name: "Regularização Fundiária",
    description: "Posse → propriedade com usucapião ou retificação.",
    initialKanban: "prospeccao",
    stages: [
      { name: "Diagnóstico fundiário", weight: 10, typicalDurationDays: 7, estimatedCost: 900, initialStatus: "in_progress" },
      { name: "Levantamento e CAR", weight: 25, typicalDurationDays: 10, estimatedCost: 5000, initialStatus: "pending" },
      { name: "Dossiê técnico-jurídico", weight: 25, typicalDurationDays: 20, estimatedCost: 3500, initialStatus: "pending" },
      { name: "Protocolo e acompanhamento", weight: 30, typicalDurationDays: 60, estimatedCost: 2000, initialStatus: "pending" },
      { name: "Registro concluído", weight: 10, typicalDurationDays: 15, estimatedCost: 500, initialStatus: "pending" },
    ],
  },
  {
    id: "planialtimetrico",
    name: "Levantamento Planialtimétrico",
    description: "Curvas de nível, locação e controle geométrico.",
    initialKanban: "execucao",
    stages: [
      { name: "Planejamento", weight: 10, typicalDurationDays: 2, estimatedCost: 500, initialStatus: "in_progress" },
      { name: "Campo GNSS/total station", weight: 50, typicalDurationDays: 3, estimatedCost: 3200, initialStatus: "pending" },
      { name: "Desenho e entrega", weight: 40, typicalDurationDays: 5, estimatedCost: 1800, initialStatus: "pending" },
    ],
  },
  {
    id: "retificacao",
    name: "Retificação de Área",
    description: "Correção de divisas e georreferenciamento urbano/rural.",
    initialKanban: "analise",
    stages: [
      { name: "Análise de matrícula", weight: 15, typicalDurationDays: 5, estimatedCost: 700, initialStatus: "in_progress" },
      { name: "Medição de confrontantes", weight: 35, typicalDurationDays: 4, estimatedCost: 4000, initialStatus: "pending" },
      { name: "Retificação cartorial", weight: 50, typicalDurationDays: 40, estimatedCost: 2500, initialStatus: "pending" },
    ],
  },
];

export function computeProgress(
  stages: { weight: number; status: string }[],
): number {
  const total = stages.reduce((s, st) => s + st.weight, 0);
  if (total === 0) return 0;
  const done = stages
    .filter((st) => st.status === "completed")
    .reduce((s, st) => s + st.weight, 0);
  return Math.round((done / total) * 100);
}
