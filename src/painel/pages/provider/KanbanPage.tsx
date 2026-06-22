import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useProjects, useProjectStats } from "@/painel/hooks/useProjects";
import { KANBAN_COLUMNS, type KanbanStatus, type Project } from "@/painel/types/database";
import { Loader2, FolderKanban, Plus } from "lucide-react";
import { formatBRL } from "@/painel/lib/pricing";
import NewProjectWizard from "@/painel/components/NewProjectWizard";
import ProjectModal from "@/painel/components/ProjectModal";

export default function KanbanPage() {
  const { projects, loading, error, updateKanbanStatus } = useProjects();
  const stats = useProjectStats(projects);
  const [active, setActive] = useState<Project | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const byColumn = KANBAN_COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = projects.filter((p) => p.kanban_status === col.id);
      return acc;
    },
    {} as Record<KanbanStatus, Project[]>,
  );

  const onDragStart = (e: DragStartEvent) => {
    const p = projects.find((x) => x.id === e.active.id);
    if (p) setActive(p);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setActive(null);
    const projectId = e.active.id as string;
    const newStatus = e.over?.id as KanbanStatus | undefined;
    if (newStatus && KANBAN_COLUMNS.some((c) => c.id === newStatus)) {
      await updateKanbanStatus(projectId, newStatus);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projetos</h1>
          <p className="text-sm text-slate-500">Kanban · arraste cards entre colunas</p>
        </div>
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          <Plus size={16} /> Novo projeto
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error} — execute a migration SQL em <code className="rounded bg-white px-1">supabase/migrations/</code>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projetos ativos" value={String(stats.ativos)} />
        <StatCard label="Progresso médio" value={`${stats.progressoMedio}%`} />
        <StatCard label="Receita carteira" value={formatBRL(stats.receita)} />
        <StatCard label="ROI carteira" value={`${stats.roi.toFixed(1)}%`} />
      </div>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              projects={byColumn[col.id]}
              onOpen={setSelected}
            />
          ))}
        </div>
        <DragOverlay>{active ? <ProjectCard project={active} dragging /> : null}</DragOverlay>
      </DndContext>

      {projects.length === 0 && !error && (
        <div className="mt-12 flex flex-col items-center text-center text-slate-500">
          <FolderKanban size={48} className="mb-4 opacity-30" />
          <p className="font-medium">Nenhum projeto ainda</p>
          <button type="button" onClick={() => setWizardOpen(true)} className="mt-4 text-sm font-semibold text-emerald-600">
            Criar primeiro projeto →
          </button>
        </div>
      )}

      <NewProjectWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function KanbanColumn({
  id, label, projects, onOpen,
}: {
  id: KanbanStatus; label: string; projects: Project[]; onOpen: (p: Project) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`w-72 flex-shrink-0 rounded-xl border p-3 transition ${isOver ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 bg-slate-100/80"}`}>
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">{projects.length}</span>
      </div>
      <div className="space-y-2">
        {projects.map((p) => (
          <DraggableProject key={p.id} project={p} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function DraggableProject({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: project.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={isDragging ? "opacity-40" : ""}>
      <ProjectCard project={project} onOpen={() => onOpen(project)} />
    </div>
  );
}

function ProjectCard({ project, dragging, onOpen }: { project: Project; dragging?: boolean; onOpen?: () => void }) {
  return (
    <article
      className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing ${dragging ? "rotate-2 shadow-lg" : ""}`}
      onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
    >
      <p className="text-sm font-semibold text-slate-900">{project.name}</p>
      <p className="mt-0.5 text-xs text-slate-500">{project.service_type}</p>
      {project.client?.name && <p className="mt-1 text-xs text-slate-400">{project.client.name}</p>}
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Progresso</span><span>{project.progress}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} />
        </div>
      </div>
      {project.contract_price != null && (
        <p className="mt-2 text-xs font-semibold text-emerald-700">{formatBRL(Number(project.contract_price))}</p>
      )}
    </article>
  );
}
