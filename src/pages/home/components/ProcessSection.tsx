import { processSteps } from "@/content/home";
import { Reveal, SectionTitle } from "@/components/EditorialHeading";
import { C, F } from "@/lib/brand";
import { MessageCircle, MapPin, FileText, Send, CheckCircle } from "lucide-react";

const icons = [MessageCircle, MapPin, FileText, Send, CheckCircle];

export default function ProcessSection() {
  return (
    <section id="processo" className="relative py-20 lg:py-28" style={{ backgroundColor: C.surface }}>
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionTitle
            badge="Como funciona"
            title="Do campo ao cartório em 5 etapas"
            highlight="5 etapas"
            subtitle="Cada fase é conduzida pela nossa equipe. Você não precisa correr atrás de nada."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => {
            const Icon = icons[i];
            const isLast = i === processSteps.length - 1;
            return (
              <Reveal key={step.step} delay={i * 70}>
                <article
                  className="relative flex h-full flex-col rounded-2xl border p-5 transition hover:shadow-card"
                  style={{
                    backgroundColor: C.white,
                    borderColor: isLast ? C.brand : C.border,
                    boxShadow: isLast ? `0 0 0 1px ${C.brand}` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: isLast ? "rgba(5,150,105,.1)" : C.surfaceAlt,
                        color: isLast ? C.brand : C.muted,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className="text-2xl font-extrabold"
                      style={{ fontFamily: F.heading, color: `${C.border}` }}
                    >
                      {step.step}
                    </span>
                  </div>

                  <span
                    className="mt-4 inline-flex self-start rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: "rgba(5,150,105,.08)",
                      color: C.brandDark,
                    }}
                  >
                    {step.badge}
                  </span>

                  <h3
                    className="mt-3 text-base font-bold"
                    style={{ fontFamily: F.heading, color: C.text, lineHeight: 1.25 }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-2 flex-1 text-sm leading-relaxed"
                    style={{ fontFamily: F.body, color: C.muted }}
                  >
                    {step.description}
                  </p>

                  {isLast && (
                    <p
                      className="mt-3 text-xs font-bold"
                      style={{ color: C.brand }}
                    >
                      ✓ Propriedade garantida
                    </p>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={350}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#contato"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl px-7 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ fontFamily: F.label, backgroundColor: C.brand, boxShadow: `0 4px 20px ${C.brandGlow}` }}
            >
              Iniciar meu processo agora
            </a>
            <p className="text-sm" style={{ fontFamily: F.body, color: C.muted }}>
              Análise gratuita · Resposta em 24h
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
