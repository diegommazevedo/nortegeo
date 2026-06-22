import { ArrowRight, Map, FileCheck, HardHat } from "lucide-react";
import { services } from "@/content/home";
import { Reveal, SectionTitle } from "@/components/EditorialHeading";
import { C, F } from "@/lib/brand";

const icons = [Map, FileCheck, HardHat];

export default function ServicesSection() {
  return (
    <section id="solucoes" className="py-20 lg:py-28" style={{ backgroundColor: C.white }}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionTitle
            badge="O que fazemos"
            title="Ecossistema completo de soluções"
            highlight="completo"
            subtitle="Do georreferenciamento ao registro — você contrata uma empresa e recebe engenharia, documentação e jurídico integrados."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={service.title} delay={index * 80}>
                <article
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border transition hover:-translate-y-1 hover:shadow-card"
                  style={{ borderColor: C.border, backgroundColor: C.surface }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(10,22,40,.7), transparent 50%)" }}
                    />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: C.brand, color: C.white }}
                      >
                        <Icon size={16} />
                      </div>
                      <span
                        className="text-xs font-semibold text-white"
                        style={{ fontFamily: F.label }}
                      >
                        {service.tag}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: F.heading, color: C.text, lineHeight: 1.2 }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="mt-3 flex-1 text-sm leading-relaxed"
                      style={{ fontFamily: F.body, color: C.muted }}
                    >
                      {service.description}
                    </p>
                    <p
                      className="mt-4 rounded-xl px-3 py-2 text-xs font-medium leading-relaxed"
                      style={{
                        fontFamily: F.body,
                        backgroundColor: "rgba(5,150,105,.06)",
                        color: C.brandDark,
                      }}
                    >
                      {service.highlight}
                    </p>
                    <a
                      href="#contato"
                      className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition hover:gap-2.5"
                      style={{ fontFamily: F.label, color: C.brand }}
                    >
                      Solicitar orçamento
                      <ArrowRight size={15} />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
