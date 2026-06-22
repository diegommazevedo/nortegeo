import { useState, type FormEvent } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { SERVICE_TEMPLATES } from "@/painel/lib/templates";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/painel/types/database";
import { useProjects } from "@/painel/hooks/useProjects";

type Props = { open: boolean; onClose: () => void };

export default function NewProjectWizard({ open, onClose }: Props) {
  const { createProject } = useProjects();
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState(SERVICE_TEMPLATES[0].id);
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<Profile[]>([]);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });
  const [projectName, setProjectName] = useState("");
  const [contractPrice, setContractPrice] = useState(8500);
  const [diasCampo, setDiasCampo] = useState(3);
  const [distancia, setDistancia] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const loadClients = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, phone, role")
      .eq("role", "client")
      .order("name");
    setClients((data ?? []) as Profile[]);
  };

  const handleOpen = () => {
    loadClients();
    setStep(0);
    setError(null);
  };

  if (open && clients.length === 0 && step === 1) loadClients();

  const createNewClient = async () => {
    setLoading(true);
    const tempPass = `Ng${Math.random().toString(36).slice(2, 10)}!`;
    const { data, error: err } = await supabase.auth.signUp({
      email: newClient.email,
      password: tempPass,
      options: { data: { name: newClient.name, role: "client", phone: newClient.phone } },
    });
    if (err || !data.user) {
      setError(err?.message ?? "Erro ao criar cliente");
      setLoading(false);
      return;
    }
    await supabase.from("profiles").upsert({
      id: data.user.id,
      name: newClient.name,
      role: "client",
      phone: newClient.phone,
    });
    setClientId(data.user.id);
    setClients((c) => [...c, { id: data.user!.id, name: newClient.name, role: "client", phone: newClient.phone }]);
    setLoading(false);
  };

  const finish = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const template = SERVICE_TEMPLATES.find((t) => t.id === templateId)!;
    const { error: err } = await createProject({
      templateId,
      clientProfileId: clientId,
      name: projectName || `${template.name} — ${clients.find((c) => c.id === clientId)?.name ?? "Cliente"}`,
      contractPrice,
      pricingParams: { diasCampo, distancia },
    });
    setLoading(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onFocus={handleOpen}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Novo projeto</h2>
            <p className="text-xs text-slate-500">Passo {step + 1} de 3</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-emerald-500" : "bg-slate-200"}`} />
          ))}
        </div>

        <form onSubmit={finish} className="p-6">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Selecione o tipo de serviço</p>
              {SERVICE_TEMPLATES.map((t) => (
                <label
                  key={t.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                    templateId === t.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    value={t.id}
                    checked={templateId === t.id}
                    onChange={() => setTemplateId(t.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.description}</p>
                    <p className="mt-1 text-xs text-emerald-600">{t.stages.length} etapas · {t.stages.reduce((s, x) => s + x.weight, 0)}% peso</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700">Cliente</p>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="rounded-xl border border-dashed border-slate-200 p-4">
                <p className="mb-3 text-xs font-semibold uppercase text-slate-500">Ou cadastrar novo</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input placeholder="Nome" value={newClient.name} onChange={(e) => setNewClient((p) => ({ ...p, name: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                  <input placeholder="E-mail" type="email" value={newClient.email} onChange={(e) => setNewClient((p) => ({ ...p, email: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm" />
                  <input placeholder="WhatsApp" value={newClient.phone} onChange={(e) => setNewClient((p) => ({ ...p, phone: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm sm:col-span-2" />
                </div>
                <button type="button" onClick={createNewClient} disabled={!newClient.email || !newClient.name} className="mt-3 text-sm font-semibold text-emerald-600 hover:underline disabled:opacity-50">
                  + Criar cliente
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-slate-500">Nome do projeto</span>
                <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" placeholder="Opcional — gerado automaticamente" />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-500">Preço contrato (R$)</span>
                <input type="number" value={contractPrice} onChange={(e) => setContractPrice(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" required />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-500">Dias de campo</span>
                <input type="number" value={diasCampo} onChange={(e) => setDiasCampo(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-slate-500">Distância (km)</span>
                <input type="number" value={distancia} onChange={(e) => setDistancia(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-4 py-3 text-sm" />
              </label>
            </div>
          )}

          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Voltar
            </button>
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !clientId}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Próximo <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !clientId}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Check size={16} /> Criar projeto
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
