import { useState, type FormEvent } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import type { Project, StageStatus, ExpenseCategory } from "@/painel/types/database";
import { useProjects } from "@/painel/hooks/useProjects";
import { formatBRL } from "@/painel/lib/pricing";
import { uploadProjectFile } from "@/painel/lib/storage";

type Props = { project: Project | null; onClose: () => void };

const STAGE_STATUSES: { value: StageStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed", label: "Concluída" },
  { value: "blocked", label: "Bloqueada" },
];

const EXPENSE_CATS: { value: ExpenseCategory; label: string }[] = [
  { value: "campo", label: "Campo" },
  { value: "deslocamento", label: "Deslocamento" },
  { value: "terceiros", label: "Terceiros" },
  { value: "proposta", label: "Proposta" },
  { value: "imprevisto", label: "Imprevisto" },
];

export default function ProjectModal({ project, onClose }: Props) {
  const { updateStageStatus, updateFieldNotes, addExpense, deleteExpense, addDeliverable } = useProjects();
  const [tab, setTab] = useState<"ops" | "fin">("ops");
  const [notes, setNotes] = useState(project?.field_notes ?? "");
  const [expForm, setExpForm] = useState({ category: "campo" as ExpenseCategory, description: "", amount: 0 });
  const [uploading, setUploading] = useState(false);

  if (!project) return null;

  const stages = [...(project.project_stages ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const expenses = project.project_expenses ?? [];
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const estimatedStages = stages.reduce((s, st) => s + Number(st.estimated_cost ?? 0), 0);
  const contract = project.contract_price ?? 0;
  const roi = totalExpenses > 0 ? ((contract - totalExpenses) / totalExpenses) * 100 : 0;

  const saveNotes = async () => {
    await updateFieldNotes(project.id, notes);
  };

  const submitExpense = async (e: FormEvent) => {
    e.preventDefault();
    await addExpense(project.id, expForm.category, expForm.description, expForm.amount);
    setExpForm({ category: "campo", description: "", amount: 0 });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const { path, error } = await uploadProjectFile(project.id, file);
    if (path) await addDeliverable(project.id, file.name, path);
    if (error) alert(error);
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{project.name}</h2>
            <p className="text-sm text-slate-500">{project.service_type} · {project.progress}%</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 px-6">
          {(["ops", "fin"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === t ? "border-emerald-500 text-emerald-700" : "border-transparent text-slate-500"
              }`}
            >
              {t === "ops" ? "Cronograma & Operações" : "Financeiro"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "ops" && (
            <div className="space-y-6">
              <div className="space-y-3">
                {stages.map((stage) => (
                  <div key={stage.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{stage.name}</p>
                        <p className="text-xs text-slate-500">Peso {stage.weight}% · {formatBRL(Number(stage.estimated_cost ?? 0))}</p>
                      </div>
                      <select
                        value={stage.status}
                        onChange={(e) => updateStageStatus(stage.id, project.id, e.target.value as StageStatus)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                      >
                        {STAGE_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${stage.status === "completed" ? "bg-emerald-500" : stage.status === "in_progress" ? "bg-blue-400" : "bg-slate-300"}`}
                        style={{ width: stage.status === "completed" ? "100%" : stage.status === "in_progress" ? "50%" : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Notas de campo</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  placeholder="Observações do levantamento..."
                />
                <button type="button" onClick={saveNotes} className="mt-2 text-sm font-semibold text-emerald-600">
                  Salvar notas
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Upload de arquivos</p>
                <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-600">
                  <Upload size={18} />
                  {uploading ? "Enviando..." : "RINEX, fotos, dados brutos..."}
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                </label>
              </div>
            </div>
          )}

          {tab === "fin" && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-4">
                <Metric label="Contrato" value={formatBRL(contract)} />
                <Metric label="Despesas" value={formatBRL(totalExpenses)} />
                <Metric label="Previsto etapas" value={formatBRL(estimatedStages)} />
                <Metric label="ROI" value={`${roi.toFixed(1)}%`} accent />
              </div>

              <form onSubmit={submitExpense} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-4">
                <select value={expForm.category} onChange={(e) => setExpForm((p) => ({ ...p, category: e.target.value as ExpenseCategory }))} className="rounded-lg border px-3 py-2 text-sm">
                  {EXPENSE_CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <input required placeholder="Descrição" value={expForm.description} onChange={(e) => setExpForm((p) => ({ ...p, description: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm sm:col-span-2" />
                <input required type="number" step="0.01" placeholder="R$" value={expForm.amount || ""} onChange={(e) => setExpForm((p) => ({ ...p, amount: Number(e.target.value) }))} className="rounded-lg border px-3 py-2 text-sm" />
                <button type="submit" className="rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white sm:col-span-4">
                  Lançar despesa
                </button>
              </form>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                    <tr><th className="px-4 py-2">Categoria</th><th className="px-4 py-2">Descrição</th><th className="px-4 py-2">Valor</th><th className="px-4 py-2" /></tr>
                  </thead>
                  <tbody>
                    {expenses.map((ex) => (
                      <tr key={ex.id} className="border-t border-slate-100">
                        <td className="px-4 py-2 capitalize">{ex.category}</td>
                        <td className="px-4 py-2">{ex.description}</td>
                        <td className="px-4 py-2 font-medium">{formatBRL(Number(ex.amount))}</td>
                        <td className="px-4 py-2">
                          <button type="button" onClick={() => deleteExpense(ex.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {expenses.length === 0 && <p className="p-4 text-center text-sm text-slate-500">Nenhuma despesa lançada.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] uppercase text-slate-500">{label}</p>
      <p className={`mt-0.5 text-lg font-bold ${accent ? "text-emerald-600" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}
