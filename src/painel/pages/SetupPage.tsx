import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Copy, CheckCircle2, Database, UserCheck } from "lucide-react";
import { asset } from "@/lib/brand";

const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = "admin7@nortegeo.com.br";
const ADMIN_PASSWORD = "admin7";

async function callFn(name: string, body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ error: "Resposta inválida" }));
}

export default function SetupPage() {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const push = (msg: string) => setLog((l) => [...l, msg]);

  const copyPath = async () => {
    await navigator.clipboard.writeText("supabase/migrations/001_nortegeo_schema.sql");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSetup = async () => {
    setBusy(true);
    setLog([]);
    push("Configurando usuário admin...");
    const r1 = await callFn("bootstrap-admin", {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: "Sócrates Souza",
      role: "provider",
      email_confirm: true,
    });
    push(JSON.stringify(r1));

    push("Testando login...");
    const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (loginRes.ok) {
      push("✓ Login OK — acesse /painel/login");
    } else {
      const err = await loginRes.json();
      push(`✗ ${err.msg ?? "Falha no login"}`);
      push("→ Supabase Dashboard → Authentication → Users → Confirm user");
      push("→ Ou desative 'Confirm email' em Auth → Providers → Email");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <img src={asset("assets/logo.png")} alt="NorteGeo" className="h-12 rounded-lg bg-white px-2 py-1" />
        <h1 className="mt-6 text-2xl font-bold">Setup NorteGeo SaaS</h1>
        <p className="mt-2 text-sm text-slate-400">Configure o banco e o usuário admin</p>

        <div className="mt-8 space-y-4">
          <Step n={1} icon={Database} title="Executar migration SQL">
            <p className="text-sm text-slate-400">
              Abra o{" "}
              <a
                href="https://supabase.com/dashboard/project/hbdoyotahgpfjecdhwio/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline"
              >
                SQL Editor
              </a>{" "}
              e execute <code className="text-emerald-300">supabase/migrations/001_nortegeo_schema.sql</code>
            </p>
            <button type="button" onClick={copyPath} className="mt-2 inline-flex items-center gap-2 text-sm text-emerald-400">
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? "Caminho copiado" : "Copiar caminho do arquivo"}
            </button>
          </Step>

          <Step n={2} icon={UserCheck} title="Criar admin root">
            <p className="text-sm text-slate-400">
              E-mail: <strong className="text-white">{ADMIN_EMAIL}</strong>
              <br />
              Senha: <strong className="text-white">{ADMIN_PASSWORD}</strong>
            </p>
            <button
              type="button"
              onClick={runSetup}
              disabled={busy}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              Executar setup
            </button>
          </Step>
        </div>

        {log.length > 0 && (
          <div className="mt-6 rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300">
            {log.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        )}

        <Link to="/painel/login" className="mt-8 inline-block text-sm text-emerald-400 hover:underline">
          → Ir para login
        </Link>
      </div>
    </div>
  );
}

function Step({ n, icon: Icon, title, children }: {
  n: number; icon: typeof Database; title: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold">{n}</span>
        <Icon size={18} className="text-emerald-400" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-3 pl-11">{children}</div>
    </div>
  );
}
