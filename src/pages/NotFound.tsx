import { useLocation, Link } from "react-router-dom";
import { asset } from "@/lib/brand";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="relative flex h-screen flex-col items-center justify-center px-4 text-center">
      <img src={asset("assets/logo.png")} alt="NorteGeo" className="mb-8 h-12" />
      <h1 className="text-2xl font-bold text-slate-900">Página não encontrada</h1>
      <p className="mt-2 font-mono text-sm text-slate-500">{location.pathname}</p>
      <Link
        to="/"
        className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
