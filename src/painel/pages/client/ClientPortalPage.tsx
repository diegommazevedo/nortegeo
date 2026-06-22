import { useProjects } from "@/painel/hooks/useProjects";
import { WHATSAPP_URL } from "@/content/home";
import { Loader2, FileText, MessageCircle, CheckCircle2, Clock } from "lucide-react";
import type { ProjectStage } from "@/painel/types/database";

export default function ClientPortalPage() {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const project = projects[0];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Meu projeto</h1>
      <p className="mt-1 text-sm text-slate-500">Acompanhe etapas e documentos</p>

      {error && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>
      )}

      {!project ? (
        <div className="mt-12 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          <p>Nenhum projeto vinculado à sua conta ainda.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <MessageCircle size={16} />
            Falar com a NorteGeo
          </a>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{project.name}</h2>
                <p className="text-sm text-slate-500">{project.service_type}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {project.progress}% concluído
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Timeline
          </h3>
          <ol className="mt-4 space-y-0">
            {(project.project_stages ?? [])
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((stage, i, arr) => (
                <StageItem key={stage.id} stage={stage} isLast={i === arr.length - 1} />
              ))}
          </ol>

          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Documentos
          </h3>
          <div className="mt-4 space-y-2">
            {(project.project_deliverables ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">Documentos serão disponibilizados conforme conclusão das etapas.</p>
            ) : (
              project.project_deliverables!.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">{d.name}</span>
                  </div>
                  {d.available ? (
                    <span className="text-xs font-semibold text-emerald-600">Disponível</span>
                  ) : (
                    <span className="text-xs text-slate-400">Em produção</span>
                  )}
                </div>
              ))
            )}
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-10 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <MessageCircle size={18} />
            Suporte via WhatsApp
          </a>
        </>
      )}
    </div>
  );
}

function StageItem({ stage, isLast }: { stage: ProjectStage; isLast: boolean }) {
  const done = stage.status === "completed";
  const active = stage.status === "in_progress";

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            done ? "bg-emerald-500 text-white" : active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
          }`}
        >
          {done ? <CheckCircle2 size={16} /> : active ? <Clock size={16} /> : <span className="text-xs">·</span>}
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200" />}
      </div>
      <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
        <p className={`font-semibold ${done || active ? "text-slate-900" : "text-slate-500"}`}>
          {stage.name}
        </p>
        <p className="text-xs capitalize text-slate-400">{stage.status.replace("_", " ")}</p>
      </div>
    </li>
  );
}
