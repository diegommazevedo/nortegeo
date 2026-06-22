import { ChevronRight } from "lucide-react";
import { Reveal, SectionTitle } from "@/components/EditorialHeading";
import { C, F, gradient } from "@/lib/brand";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24" style={{ background: gradient.hero }}>
      <div className="absolute inset-0 grid-pattern-dark opacity-50" />
      <div className="absolute inset-0" style={{ background: gradient.mesh }} />

      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        <Reveal>
          <SectionTitle
            badge="Chega de esperar"
            title="Sua terra merece ser patrimônio"
            highlight="patrimônio"
            subtitle="Responda 4 perguntas rápidas e receba uma análise gratuita em até 24 horas. Sem compromisso."
            dark
            align="center"
          />
        </Reveal>
        <Reveal delay={180}>
          <a
            href="#contato"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-8 text-sm font-semibold text-white transition hover:opacity-90"
            style={{
              fontFamily: F.label,
              background: gradient.brand,
              boxShadow: `0 4px 28px ${C.brandGlow}`,
            }}
          >
            Quero minha análise gratuita
            <ChevronRight size={17} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
