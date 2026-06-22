import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { Organization, OrgStatus } from "@/painel/types/database";
import { Loader2, Building2, Plus, X } from "lucide-react";

const emptyOrg = { name: "", slug: "", plan: "starter", user_limit: 5, cnpj: "", phone: "", status: "ativa" as OrgStatus };

export default function AdminLicensesPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyOrg);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchOrgs = async () => {
    setLoading(true);
    const { data } = await supabase.from("organizations").select("*").order("name");
    setOrgs((data ?? []) as Organization[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrgs(); }, []);

  const openCreate = () => { setForm(emptyOrg); setEditId(null); setModal(true); };
  const openEdit = (org: Organization) => {
    setForm({ name: org.name, slug: org.slug, plan: org.plan, user_limit: org.user_limit, cnpj: org.cnpj ?? "", phone: org.phone ?? "", status: org.status });
    setEditId(org.id);
    setModal(true);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...form, cnpj: form.cnpj || null, phone: form.phone || null };
    if (editId) {
      await supabase.from("organizations").update(payload).eq("id", editId);
    } else {
      await supabase.from("organizations").insert(payload);
    }
    setModal(false);
    fetchOrgs();
  };

  const remove = async (id: string) => {
    if (!confirm("Suspender esta organização?")) return;
    await supabase.from("organizations").update({ status: "suspensa" }).eq("id", id);
    fetchOrgs();
  };

  const stats = {
    total: orgs.length,
    ativas: orgs.filter((o) => o.status === "ativa").length,
    suspensas: orgs.filter((o) => o.status === "suspensa").length,
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Licenças</h1>
          <p className="text-sm text-slate-500">Multi-tenant · acesso root admin</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white">
          <Plus size={16} /> Nova organização
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <MiniStat label="Total" value={stats.total} />
        <MiniStat label="Ativas" value={stats.ativas} accent />
        <MiniStat label="Suspensas" value={stats.suspensas} warn />
      </div>

      <div className="space-y-3">
        {orgs.map((org) => (
          <article key={org.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Building2 size={20} /></div>
              <div>
                <p className="font-semibold text-slate-900">{org.name}</p>
                <p className="text-xs text-slate-500">{org.slug} · {org.plan} · {org.user_limit} usuários</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${org.status === "ativa" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{org.status}</span>
              <button type="button" onClick={() => openEdit(org)} className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">Editar</button>
              <button type="button" onClick={() => remove(org.id)} className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">Suspender</button>
            </div>
          </article>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(false)}>
          <form onSubmit={save} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">{editId ? "Editar" : "Nova"} organização</h2>
              <button type="button" onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {(["name", "slug", "plan", "cnpj", "phone"] as const).map((k) => (
                <label key={k} className="block">
                  <span className="text-xs capitalize text-slate-500">{k}</span>
                  <input required={k === "name" || k === "slug"} value={form[k]} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </label>
              ))}
              <label className="block">
                <span className="text-xs text-slate-500">Limite usuários</span>
                <input type="number" value={form.user_limit} onChange={(e) => setForm((p) => ({ ...p, user_limit: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">Status</span>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as OrgStatus }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                  <option value="ativa">Ativa</option>
                  <option value="suspensa">Suspensa</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </label>
            </div>
            <button type="submit" className="mt-5 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white">Salvar</button>
          </form>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, accent, warn }: { label: string; value: number; accent?: boolean; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-emerald-600" : warn ? "text-amber-600" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}
