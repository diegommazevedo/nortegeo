import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { usePainelAuth, getDefaultPainelPath } from "@/painel/hooks/usePainelAuth";
import { GuestGuard } from "@/painel/components/AuthGuard";
import { asset } from "@/lib/brand";

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginForm />
    </GuestGuard>
  );
}

function LoginForm() {
  const { signIn } = usePainelAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }
    navigate(from ?? "/painel", { replace: true });
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <img src={asset("assets/logo.png")} alt="NorteGeo" className="mx-auto h-12 rounded-lg bg-white px-2 py-1" />
          <h1 className="mt-4 text-xl font-bold text-white">Área restrita</h1>
          <p className="mt-1 text-sm text-slate-400">Painel NorteGeo SaaS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-slate-400">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
              placeholder="seu@email.com"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Senha</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <Link to="/painel/register" className="font-medium text-emerald-400 hover:underline">
            Cadastrar
          </Link>
        </p>
        <p className="mt-3 text-center">
          <Link to="/painel/setup" className="text-xs text-amber-400/80 hover:text-amber-300">
            Primeira vez? Configurar banco →
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Hub pós-login — redireciona conforme role */
export function PainelRedirect() {
  const { profile, loading, isAdmin } = usePainelAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }
  return <Navigate to={getDefaultPainelPath(profile, isAdmin)} replace />;
}
