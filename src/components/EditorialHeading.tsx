import type { ReactNode, CSSProperties } from "react";
import { useReveal } from "@/hooks/useScrollReveal";
import { C, F } from "@/lib/brand";

/* ── Reveal wrapper ───────────────────────────────────────── */
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
};
export function Reveal({ children, className = "", delay = 0, style }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </div>
  );
}

/* ── Pill badge (substitui Eyebrow) ───────────────────────── */
type BadgeProps = { children: ReactNode; dark?: boolean };
export function Badge({ children, dark = false }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
      style={{
        fontFamily: F.label,
        backgroundColor: dark ? "rgba(52,211,153,.12)" : "rgba(5,150,105,.08)",
        color: dark ? C.brandLight : C.brandDark,
        border: `1px solid ${dark ? "rgba(52,211,153,.25)" : "rgba(5,150,105,.2)"}`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: dark ? C.brandLight : C.brand }}
      />
      {children}
    </span>
  );
}

/** @deprecated use Badge */
export const Eyebrow = Badge;

/* ── Section heading startup ──────────────────────────────── */
type SectionTitleProps = {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
};
export function SectionTitle({
  badge,
  title,
  highlight,
  subtitle,
  dark = false,
  align = "left",
  className = "",
}: SectionTitleProps) {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <div className={className} style={{ textAlign: align }}>
      {badge && (
        <div className={align === "center" ? "flex justify-center" : ""}>
          <Badge dark={dark}>{badge}</Badge>
        </div>
      )}
      <h2
        className={`${badge ? "mt-4" : ""} font-extrabold tracking-tight`}
        style={{
          fontFamily: F.heading,
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          lineHeight: 1.15,
          color: dark ? C.white : C.text,
        }}
      >
        {highlight && parts.length === 2 ? (
          <>
            {parts[0]}
            <span className="text-gradient">{highlight}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p
          className="mt-3 max-w-2xl text-base leading-relaxed"
          style={{
            fontFamily: F.body,
            color: dark ? "rgba(255,255,255,.65)" : C.muted,
            marginLeft: align === "center" ? "auto" : undefined,
            marginRight: align === "center" ? "auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** @deprecated use SectionTitle */
export function EditorialH2({
  a, b, c, light = false, align = "left", className = "",
}: { a: string; b: string; c: string; light?: boolean; align?: "left" | "center"; className?: string }) {
  return (
    <SectionTitle
      title={`${a} ${b} ${c}`}
      highlight={b}
      dark={light}
      align={align}
      className={className}
    />
  );
}
