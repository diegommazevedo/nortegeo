/** Tokens NorteGeo — estilo startup PropTech/AgTech */
export const C = {
  white:      "#FFFFFF",
  surface:    "#F8FAFC",
  surfaceAlt: "#F1F5F9",
  border:     "#E2E8F0",
  muted:      "#64748B",
  text:       "#0F172A",
  textSoft:   "#334155",
  navy950:    "#040B14",
  navy900:    "#0A1628",
  navy800:    "#122640",
  navy700:    "#1A3354",
  brand:      "#059669",
  brandLight: "#34D399",
  brandDark:  "#047857",
  brandGlow:  "rgba(5,150,105,.35)",
  accent:     "#2563EB",
  accentLight:"#60A5FA",
  warn:       "#EF4444",
  warnSoft:   "#FEF2F2",
  whatsapp:   "#25D366",
} as const;

export const F = {
  heading: '"Plus Jakarta Sans", system-ui, sans-serif',
  body:    '"Plus Jakarta Sans", system-ui, sans-serif',
  label:   '"Plus Jakarta Sans", system-ui, sans-serif',
} as const;

export const gradient = {
  brand: "linear-gradient(135deg, #059669 0%, #34D399 100%)",
  hero:  "linear-gradient(135deg, #0A1628 0%, #122640 50%, #0A1628 100%)",
  mesh:  "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(5,150,105,.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(37,99,235,.12) 0%, transparent 55%)",
  text:  "linear-gradient(135deg, #34D399 0%, #059669 50%, #2563EB 100%)",
} as const;

/** Caminho de asset público respeitando BASE_PATH (GitHub Pages, etc.) */
export function asset(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
