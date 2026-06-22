import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, WHATSAPP_URL } from "@/content/home";
import { C, F, asset } from "@/lib/brand";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onHero = !scrolled;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: onHero ? "rgba(10,22,40,.55)" : "rgba(255,255,255,.85)",
        backdropFilter: "blur(16px)",
        borderBottom: onHero ? "1px solid rgba(255,255,255,.08)" : `1px solid ${C.border}`,
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,.06)" : undefined,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <img
            src={asset("assets/logo.png")}
            alt="NorteGeo"
            className="h-11 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:bg-black/5"
              style={{
                fontFamily: F.body,
                color: onHero ? "rgba(255,255,255,.85)" : C.textSoft,
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{
              fontFamily: F.label,
              backgroundColor: C.whatsapp,
              boxShadow: "0 4px 14px rgba(37,211,102,.35)",
            }}
          >
            WhatsApp
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
          style={{
            color: onHero ? C.white : C.text,
            backgroundColor: onHero ? "rgba(255,255,255,.1)" : C.surfaceAlt,
          }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="border-t px-5 py-4 lg:hidden"
          style={{ backgroundColor: C.white, borderColor: C.border }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-slate-50"
                style={{ fontFamily: F.body, color: C.textSoft }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-xl py-3.5 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: C.whatsapp }}
              onClick={() => setOpen(false)}
            >
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
