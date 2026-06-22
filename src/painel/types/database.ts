/** Papéis do SaaS NorteGeo */
export type UserRole = "provider" | "client";

export type KanbanStatus =
  | "prospeccao"
  | "analise"
  | "levantamento"
  | "execucao"
  | "finalizacao"
  | "concluido";

export type StageStatus = "pending" | "in_progress" | "completed" | "blocked";

export type ExpenseCategory =
  | "campo"
  | "deslocamento"
  | "terceiros"
  | "proposta"
  | "imprevisto";

export type OrgStatus = "ativa" | "suspensa" | "cancelada";

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  cpf?: string | null;
  phone?: string | null;
  organization_id?: string | null;
  created_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  user_limit: number;
  cnpj?: string | null;
  address?: string | null;
  phone?: string | null;
  status: OrgStatus;
  created_at?: string;
}

export interface CostParameter {
  id: string;
  organization_id?: string | null;
  key: string;
  label: string;
  value: number;
  unit?: string | null;
  category: string;
}

export interface ProjectStage {
  id: string;
  project_id: string;
  name: string;
  weight: number;
  status: StageStatus;
  typical_duration_days?: number | null;
  estimated_cost?: number | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  sort_order: number;
}

export interface ProjectExpense {
  id: string;
  project_id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  created_at?: string;
}

export interface ProjectDeliverable {
  id: string;
  project_id: string;
  name: string;
  file_path?: string | null;
  available: boolean;
  created_at?: string;
}

export interface Project {
  id: string;
  organization_id?: string | null;
  client_id?: string | null;
  client_profile_id?: string | null;
  name: string;
  service_type: string;
  kanban_status: KanbanStatus;
  contract_price?: number | null;
  progress: number;
  pricing_params?: Record<string, number> | null;
  field_notes?: string | null;
  created_at?: string;
  updated_at?: string;
  project_stages?: ProjectStage[];
  project_expenses?: ProjectExpense[];
  project_deliverables?: ProjectDeliverable[];
  client?: Pick<Profile, "id" | "name" | "phone"> | null;
}

export interface PricingInput {
  diasCampo: number;
  diasAjudante: number;
  equipe: number;
  distanciaKm: number;
  taxaArt: number;
  emolumentos: number;
  taxaImposto: number;
  lucroAlvo: number;
  diariaTecnico: number;
  diariaAjudante: number;
  custoKm: number;
  despesaExtraDia: number;
}

export interface PricingResult {
  custoTecnico: number;
  custoAjudante: number;
  custoDeslocamento: number;
  subtotal: number;
  imposto: number;
  custoTotal: number;
  precoSugerido: number;
  roi: number;
}

export const KANBAN_COLUMNS: { id: KanbanStatus; label: string }[] = [
  { id: "prospeccao", label: "Prospecção" },
  { id: "analise", label: "Análise" },
  { id: "levantamento", label: "Levantamento" },
  { id: "execucao", label: "Execução" },
  { id: "finalizacao", label: "Finalização" },
  { id: "concluido", label: "Concluído" },
];
