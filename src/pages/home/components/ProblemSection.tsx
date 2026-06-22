import { ChevronRight, Clock, AlertTriangle, TrendingDown } from "lucide-react";
import { painPoints } from "@/content/home";
import { Reveal, SectionTitle } from "@/components/EditorialHeading";
import { C, F } from "@/lib/brand";

const icons = [Clock, AlertTriangle, TrendingDown];

export default function ProblemSection() {
  return (
    <section id="problema" className="relative py-20 lg:py-28" style={{ backgroundColor: C.surface }}>
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionTitle
            badge="O problema"
            title="Burocracia não pode ser dona da sua terra"
            highlight="dona da sua terra"
            subtitle="Milhares de proprietários no Norte do ES perdem tempo, dinheiro e segurança jurídica tentando resolver sozinhos."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {painPoints.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={item.title} delay={i * 80}>
                <article
                  className="group h-full rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-card"
                  style={{
                    backgroundColor: C.white,
                    borderColor: C.border,
                    boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                  }}
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: C.warnSoft, color: C.warn }}
                  >
                    <Icon size={20} />
                  </div>
                  <p
                    className="text-3xl font-extrabold tracking-tight"
                    style={{ fontFamily: F.heading, color: C.warn }}
                  >
                    {item.stat}
                  </p>
                  <p
                    className="mt-2 text-sm font-semibold"
                    style={{ fontFamily: F.label, color: C.text }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ fontFamily: F.body, color: C.muted }}
                  >
                    {item.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={260}>
          <div
            className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border p-6 sm:flex-row sm:items-center md:p-8"
            style={{
              backgroundColor: C.white,
              borderColor: C.border,
              borderLeft: `4px solid ${C.brand}`,
            }}
          >
            <p
              className="text-lg font-semibold md:text-xl"
              style={{ fontFamily: F.heading, color: C.text }}
            >
              Mas existe um caminho mais curto.{" "}
              <span style={{ color: C.brand }}>A NorteGeo resolve tudo.</span>
            </p>
            <a
              href="#solucoes"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ fontFamily: F.label, backgroundColor: C.brand }}
            >
              Ver soluções <ChevronRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
