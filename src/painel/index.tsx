import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home, Loader2 } from "lucide-react";
import { PainelAuthProvider } from "@/painel/hooks/usePainelAuth";
import { AuthGuard } from "@/painel/components/AuthGuard";
import { PainelLayout, providerNav } from "@/painel/components/PainelLayout";

const SetupPage = lazy(() => import("@/painel/pages/SetupPage"));
const LoginPage = lazy(() => import("@/painel/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/painel/pages/RegisterPage"));
const PainelRedirect = lazy(() =>
  import("@/painel/pages/LoginPage").then((m) => ({ default: m.PainelRedirect })),
);

const KanbanPage = lazy(() => import("@/painel/pages/provider/KanbanPage"));
const PricingPage = lazy(() => import("@/painel/pages/provider/PricingPage"));
const CostParamsPage = lazy(() => import("@/painel/pages/provider/CostParamsPage"));
const ClientsPage = lazy(() => import("@/painel/pages/provider/ClientsPage"));
const ClientPortalPage = lazy(() => import("@/painel/pages/client/ClientPortalPage"));
const AdminLicensesPage = lazy(() => import("@/painel/pages/admin/AdminLicensesPage"));

const clientNav = [{ to: "/painel/client", label: "Meu projeto", icon: Home }] as const;

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
    </div>
  );
}

function SuspenseWrap({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function PainelApp() {
  return (
    <PainelAuthProvider>
      <Routes>
        <Route path="setup" element={<SuspenseWrap><SetupPage /></SuspenseWrap>} />
        <Route path="login" element={<SuspenseWrap><LoginPage /></SuspenseWrap>} />
        <Route path="register" element={<SuspenseWrap><RegisterPage /></SuspenseWrap>} />
        <Route path="" element={<SuspenseWrap><PainelRedirect /></SuspenseWrap>} />

        <Route
          element={
            <AuthGuard roles={["provider"]}>
              <PainelLayout title="Gestão técnica" />
            </AuthGuard>
          }
        >
          <Route path="provider" element={<SuspenseWrap><KanbanPage /></SuspenseWrap>} />
          <Route path="provider/precificacao" element={<SuspenseWrap><PricingPage /></SuspenseWrap>} />
          <Route path="provider/parametros" element={<SuspenseWrap><CostParamsPage /></SuspenseWrap>} />
          <Route path="provider/clientes" element={<SuspenseWrap><ClientsPage /></SuspenseWrap>} />
        </Route>

        <Route
          element={
            <AuthGuard roles={["client"]}>
              <PainelLayout title="Portal do cliente" nav={[...clientNav]} />
            </AuthGuard>
          }
        >
          <Route path="client" element={<SuspenseWrap><ClientPortalPage /></SuspenseWrap>} />
        </Route>

        <Route
          element={
            <AuthGuard adminOnly>
              <PainelLayout title="Administração" nav={providerNav} />
            </AuthGuard>
          }
        >
          <Route path="admin" element={<SuspenseWrap><AdminLicensesPage /></SuspenseWrap>} />
        </Route>

        <Route path="*" element={<Navigate to="/painel" replace />} />
      </Routes>
    </PainelAuthProvider>
  );
}
