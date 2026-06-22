import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type {
  Project,
  KanbanStatus,
  ProjectStage,
  ProjectExpense,
  ExpenseCategory,
  StageStatus,
} from "@/painel/types/database";
import { SERVICE_TEMPLATES, computeProgress } from "@/painel/lib/templates";
import { usePainelAuth } from "@/painel/hooks/usePainelAuth";

const PROJECT_SELECT = `
  *,
  project_stages (*),
  project_expenses (*),
  project_deliverables (*),
  client:profiles!projects_client_profile_id_fkey (id, name, phone)
`;

function mapProject(p: Record<string, unknown>): Project {
  const stages = (p.project_stages as ProjectStage[]) ?? [];
  return {
    ...(p as unknown as Project),
    progress: computeProgress(stages),
  };
}

export function useProjects() {
  const { organizationId, isAdmin, profile } = usePainelAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);

    let query = supabase.from("projects").select(PROJECT_SELECT).order("updated_at", { ascending: false });

    if (!isAdmin && organizationId) {
      query = query.eq("organization_id", organizationId);
    } else if (profile.role === "client") {
      query = query.or(`client_id.eq.${profile.id},client_profile_id.eq.${profile.id}`);
    }

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
      setProjects([]);
    } else {
      setProjects((data ?? []).map(mapProject));
    }
    setLoading(false);
  }, [organizationId, isAdmin, profile]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const updateKanbanStatus = useCallback(async (projectId: string, status: KanbanStatus) => {
    const { error: err } = await supabase
      .from("projects")
      .update({ kanban_status: status, updated_at: new Date().toISOString() })
      .eq("id", projectId);
    if (!err) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, kanban_status: status } : p)),
      );
    }
    return { error: err?.message ?? null };
  }, []);

  const createProject = useCallback(
    async (opts: {
      templateId: string;
      clientProfileId: string;
      name: string;
      contractPrice: number;
      pricingParams?: Record<string, number>;
    }) => {
      const template = SERVICE_TEMPLATES.find((t) => t.id === opts.templateId);
      if (!template) return { error: "Template não encontrado", project: null };

      const { data: project, error: err } = await supabase
        .from("projects")
        .insert({
          name: opts.name,
          service_type: template.name,
          kanban_status: template.initialKanban,
          client_profile_id: opts.clientProfileId,
          organization_id: organizationId,
          contract_price: opts.contractPrice,
          pricing_params: opts.pricingParams ?? null,
        })
        .select()
        .single();

      if (err || !project) return { error: err?.message ?? "Erro ao criar projeto", project: null };

      const stages = template.stages.map((s, i) => ({
        project_id: project.id,
        name: s.name,
        weight: s.weight,
        status: s.initialStatus,
        typical_duration_days: s.typicalDurationDays,
        estimated_cost: s.estimatedCost,
        sort_order: i,
      }));

      const { error: stageErr } = await supabase.from("project_stages").insert(stages);
      if (stageErr) return { error: stageErr.message, project: null };

      await fetchProjects();
      return { error: null, project: project as Project };
    },
    [organizationId, fetchProjects],
  );

  const updateStageStatus = useCallback(
    async (stageId: string, projectId: string, status: StageStatus) => {
      const patch: Partial<ProjectStage> = { status };
      const today = new Date().toISOString().slice(0, 10);
      if (status === "in_progress") patch.actual_start_date = today;
      if (status === "completed") patch.actual_end_date = today;

      const { error: err } = await supabase.from("project_stages").update(patch).eq("id", stageId);
      if (!err) await fetchProjects();
      return { error: err?.message ?? null };
    },
    [fetchProjects],
  );

  const updateFieldNotes = useCallback(
    async (projectId: string, notes: string) => {
      const { error: err } = await supabase
        .from("projects")
        .update({ field_notes: notes.slice(0, 500) })
        .eq("id", projectId);
      if (!err) await fetchProjects();
      return { error: err?.message ?? null };
    },
    [fetchProjects],
  );

  const addExpense = useCallback(
    async (projectId: string, category: ExpenseCategory, description: string, amount: number) => {
      const { error: err } = await supabase.from("project_expenses").insert({
        project_id: projectId,
        category,
        description,
        amount,
      });
      if (!err) await fetchProjects();
      return { error: err?.message ?? null };
    },
    [fetchProjects],
  );

  const deleteExpense = useCallback(
    async (expenseId: string) => {
      const { error: err } = await supabase.from("project_expenses").delete().eq("id", expenseId);
      if (!err) await fetchProjects();
      return { error: err?.message ?? null };
    },
    [fetchProjects],
  );

  const addDeliverable = useCallback(
    async (projectId: string, name: string, filePath: string) => {
      const { error: err } = await supabase.from("project_deliverables").insert({
        project_id: projectId,
        name,
        file_path: filePath,
        available: true,
      });
      if (!err) await fetchProjects();
      return { error: err?.message ?? null };
    },
    [fetchProjects],
  );

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    updateKanbanStatus,
    createProject,
    updateStageStatus,
    updateFieldNotes,
    addExpense,
    deleteExpense,
    addDeliverable,
  };
}

export function useProjectStats(projects: Project[]) {
  const ativos = projects.filter((p) => p.kanban_status !== "concluido").length;
  const progressoMedio =
    projects.length > 0
      ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
      : 0;
  const receita = projects.reduce((s, p) => s + (p.contract_price ?? 0), 0);
  const despesas = projects.reduce(
    (s, p) => s + (p.project_expenses ?? []).reduce((a, e) => a + e.amount, 0),
    0,
  );
  const roi = despesas > 0 ? ((receita - despesas) / despesas) * 100 : 0;
  return { ativos, progressoMedio, receita, despesas, roi };
}
