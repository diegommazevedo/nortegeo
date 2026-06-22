import { useState, type FormEvent } from "react";
import { formQuestions, WHATSAPP_URL, WHATSAPP_DISPLAY, EMAIL } from "@/content/home";
import { Reveal, Badge } from "@/components/EditorialHeading";
import { C, F, gradient, asset } from "@/lib/brand";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

type FormState = {
  name: string; phone: string; propertyType: string;
  situation: string; municipality: string; urgency: string;
};
const empty: FormState = { name: "", phone: "", propertyType: "", situation: "", municipality: "", urgency: "" };

function LeadForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [ok, setOk] = useState(false);
  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const send = (e: FormEvent) => {
    e.preventDefault();
    const msg = [
      "Olá! Quero uma análise gratuita da minha terra.",
      `Nome: ${form.name}`, `WhatsApp: ${form.phone}`,
      `Tipo: ${form.propertyType}`, `Situação: ${form.situation}`,
      `Município: ${form.municipality}`, `Urgência: ${form.urgency}`,
    ].join("\n");
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, "_blank", "noreferrer");
    setOk(true);
  };

  const inputCls = "mt-1.5 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2";
  const inputStyle = {
    fontFamily: F.body,
    borderColor: C.border,
    backgroundColor: C.surface,
    color: C.text,
  };

  return (
    <Reveal>
      <div
        className="rounded-3xl border p-7 lg:p-8"
        style={{ backgroundColor: C.white, borderColor: C.border, boxShadow: "0 8px 32px rgba(0,0,0,.08)" }}
      >
        <Badge>Análise gratuita</Badge>
        <h3
          className="mt-4 text-2xl font-bold md:text-3xl"
          style={{ fontFamily: F.heading, color: C.text, lineHeight: 1.15 }}
        >
          Conte sua situação.
          <br />
          <span style={{ color: C.brand }}>Retornamos em 24h.</span>
        </h3>

        {ok ? (
          <div
            className="mt-8 rounded-2xl border-l-4 p-5"
            style={{ borderColor: C.brand, backgroundColor: "rgba(5,150,105,.06)" }}
          >
            <p className="font-bold" style={{ fontFamily: F.heading, color: C.brandDark }}>
              Obrigado! Abrimos o WhatsApp para você.
            </p>
            <p className="mt-1 text-sm" style={{ fontFamily: F.body, color: C.muted }}>
              Envie a mensagem e aguarde nosso retorno em até 24h.
            </p>
          </div>
        ) : (
          <form onSubmit={send} className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { id: "name", label: "Seu nome", placeholder: "Como podemos te chamar?", span: 2 },
              { id: "phone", label: "WhatsApp", placeholder: "(27) 99999-9999", span: 2 },
            ].map((f) => (
              <label key={f.id} className={`block ${f.span === 2 ? "md:col-span-2" : ""}`}>
                <span className="text-xs font-semibold" style={{ fontFamily: F.label, color: C.textSoft }}>
                  {f.label}
                </span>
                <input
                  required
                  value={form[f.id as keyof FormState]}
                  onChange={(e) => set(f.id as keyof FormState, e.target.value)}
                  className={inputCls}
                  style={{ ...inputStyle, "--tw-ring-color": "rgba(5,150,105,.3)" } as React.CSSProperties}
                  placeholder={f.placeholder}
                />
              </label>
            ))}
            {formQuestions.map((q) => (
              <label
                key={q.id}
                className={`block ${"options" in q && q.id !== "municipality" ? "" : "md:col-span-2"}`}
              >
                <span className="text-xs font-semibold" style={{ fontFamily: F.label, color: C.textSoft }}>
                  {q.label}
                </span>
                {"options" in q ? (
                  <select
                    required
                    value={form[q.id as keyof FormState]}
                    onChange={(e) => set(q.id as keyof FormState, e.target.value)}
                    className={inputCls}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Selecione</option>
                    {q.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    value={form[q.id as keyof FormState]}
                    onChange={(e) => set(q.id as keyof FormState, e.target.value)}
                    className={inputCls}
                    style={inputStyle}
                    placeholder={q.placeholder}
                  />
                )}
              </label>
            ))}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ fontFamily: F.label, background: gradient.brand, boxShadow: `0 4px 18px ${C.brandGlow}` }}
              >
                Enviar e receber análise gratuita
              </button>
              <p className="mt-3 text-center text-xs" style={{ fontFamily: F.body, color: C.muted }}>
                Ou fale agora:{" "}
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-semibold" style={{ color: C.brand }}>
                  {WHATSAPP_DISPLAY}
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </Reveal>
  );
}

export function FooterSection() {
  const contacts = [
    { Icon: MapPin, text: "Av. Valderedo Faria, 671 — Braço do Rio, Conceição da Barra, ES" },
    { Icon: Phone, text: WHATSAPP_DISPLAY, href: WHATSAPP_URL },
    { Icon: Mail, text: EMAIL, href: `mailto:${EMAIL}` },
    { Icon: Clock, text: "Segunda a Sexta · 08h às 18h" },
  ];

  return (
    <footer id="contato" className="relative" style={{ backgroundColor: C.navy950 }}>
      <div className="absolute inset-0 grid-pattern-dark opacity-20 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_480px] lg:gap-16">
          <div>
            <img
              src={asset("assets/logo.png")}
              alt="NorteGeo"
              className="h-12 w-auto rounded-lg bg-white px-2 py-1"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed" style={{ fontFamily: F.body, color: "rgba(255,255,255,.55)" }}>
              Ecossistema integrado de topografia, regularização fundiária,
              despachante documental e assessoria jurídica no Norte do ES.
            </p>
            <div className="mt-8 space-y-4">
              {contacts.map(({ Icon, text, href }) => (
                <div key={text} className="flex items-start gap-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(52,211,153,.1)", color: C.brandLight }}
                  >
                    <Icon size={14} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="text-sm transition hover:text-white"
                      style={{ fontFamily: F.body, color: "rgba(255,255,255,.6)" }}
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ fontFamily: F.body, color: "rgba(255,255,255,.6)" }}>
                      {text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <LeadForm />
        </div>

        <div
          className="mt-14 flex flex-col items-center justify-between gap-3 border-t pt-8 md:flex-row"
          style={{ borderColor: "rgba(255,255,255,.08)" }}
        >
          <p className="text-xs" style={{ fontFamily: F.body, color: "rgba(255,255,255,.35)" }}>
            © {new Date().getFullYear()} NorteGeo Engenharia e Topografia. Todos os direitos reservados.
          </p>
          <p className="text-xs font-medium" style={{ fontFamily: F.label, color: "rgba(255,255,255,.35)" }}>
            Conceição da Barra · Norte do Espírito Santo
            {" · "}
            <a href="/painel/login" className="transition hover:text-white/60">
              Área do cliente
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
