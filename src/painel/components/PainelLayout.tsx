import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calculator,
  Settings,
  Users,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { usePainelAuth } from "@/painel/hooks/usePainelAuth";
import { asset } from "@/lib/brand";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

export const providerNav: NavItem[] = [
  { to: "/painel/provider", label: "Projetos", icon: LayoutDashboard },
  { to: "/painel/provider/precificacao", label: "Precificação", icon: Calculator },
  { to: "/painel/provider/parametros", label: "Parâmetros", icon: Settings },
  { to: "/painel/provider/clientes", label: "Clientes", icon: Users },
];

function navClass(isActive: boolean, compact = false) {
  if (compact) {
    return `flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition ${
      isActive ? "text-emerald-600" : "text-slate-500"
    }`;
  }
  return `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-50 text-emerald-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;
}

function NavItems({
  nav,
  isAdmin,
  compact = false,
  onNavigate,
}: {
  nav: NavItem[];
  isAdmin: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const items = isAdmin
    ? [...nav, { to: "/painel/admin", label: "Licenças", icon: Shield }]
    : nav;

  return (
    <>
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/painel/provider" || to === "/painel/client" || to === "/painel/admin"}
          onClick={onNavigate}
          className={({ isActive }) => navClass(isActive, compact)}
        >
          <Icon size={compact ? 20 : 18} />
          <span className={compact ? "truncate" : undefined}>{label}</span>
        </NavLink>
      ))}
    </>
  );
}

export function PainelLayout({ nav = providerNav, title = "NorteGeo SaaS" }: {
  nav?: NavItem[];
  title?: string;
}) {
  const { profile, signOut, isAdmin } = usePainelAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const handleSignOut = async () => {
    closeMobile();
    await signOut();
    navigate("/painel/login");
  };

  const effectiveNav = nav.length > 0 ? nav : providerNav;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar — sempre visível a partir de md; drawer no mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 md:static md:z-auto md:shadow-none md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <img src={asset("assets/logo.png")} alt="NorteGeo" className="h-10 w-auto" />
            <p className="mt-2 text-xs font-semibold text-slate-500">{title}</p>
          </div>
          <button
            type="button"
            onClick={closeMobile}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavItems nav={effectiveNav} isAdmin={isAdmin} onNavigate={closeMobile} />
        </nav>
        <div className="border-t border-slate-100 p-4">
          <p className="truncate text-sm font-semibold text-slate-800">{profile?.name}</p>
          <p className="text-xs capitalize text-slate-500">{profile?.role}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <span className="text-sm font-semibold text-slate-700">{title}</span>
          <button type="button" onClick={handleSignOut} className="text-sm font-medium text-slate-600">
            Sair
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6 lg:p-8">
          <Outlet />
        </main>

        {/* Barra inferior no mobile */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-200 bg-white md:hidden">
          <NavItems nav={effectiveNav} isAdmin={isAdmin} compact onNavigate={closeMobile} />
        </nav>
      </div>
    </div>
  );
}
