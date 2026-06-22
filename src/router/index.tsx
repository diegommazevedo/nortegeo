import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/home/page";
import NotFound from "@/pages/NotFound";

/** Chunk separado — site institucional NÃO carrega o SaaS */
const PainelApp = lazy(() => import("@/painel"));

function PainelFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/painel/*"
        element={
          <Suspense fallback={<PainelFallback />}>
            <PainelApp />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
