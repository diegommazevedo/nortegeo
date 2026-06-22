import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePainelAuth, getDefaultPainelPath } from "@/painel/hooks/usePainelAuth";
import type { UserRole } from "@/painel/types/database";
import { Loader2 } from "lucide-react";

type AuthGuardProps = {
  children: ReactNode;
  roles?: UserRole[];
  adminOnly?: boolean;
};

export function AuthGuard({ children, roles, adminOnly }: AuthGuardProps) {
  const { user, profile, loading, isAdmin } = usePainelAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/painel/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to={getDefaultPainelPath(profile, isAdmin)} replace />;
  }

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to={getDefaultPainelPath(profile, isAdmin)} replace />;
  }

  return <>{children}</>;
}

/** Redireciona usuários já autenticados (login/register) */
export function GuestGuard({ children }: { children: ReactNode }) {
  const { user, profile, loading, isAdmin } = usePainelAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (user && profile) {
    return <Navigate to={getDefaultPainelPath(profile, isAdmin)} replace />;
  }

  return <>{children}</>;
}
