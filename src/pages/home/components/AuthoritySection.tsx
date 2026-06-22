import { authorityPoints, WHATSAPP_URL } from "@/content/home";
import { Reveal, SectionTitle } from "@/components/EditorialHeading";
import { C, F } from "@/lib/brand";
import { GraduationCap, Scale, ArrowRight } from "lucide-react";

const icons = [GraduationCap, Scale];

export default function AuthoritySection() {
  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: C.white }}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl" style={{ boxShadow: "0 24px 48px rgba(0,0,0,.12)" }}>
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
                  alt="Sócrates Souza — Diretor Técnico NorteGeo"
                  className="aspect-[4/5] w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div
                className="absolute -bottom-4 -right-4 rounded-2xl px-5 py-4"
                style={{
                  backgroundColor: C.brand,
                  boxShadow: `0 8px 24px ${C.brandGlow}`,
                }}
              >
                <p className="text-xs font-semibold text-white/80">Diretor Técnico</p>
                <p className="text-lg font-bold text-white">CREA-ES</p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionTitle
                badge="Quem está à frente"
                title="Sócrates Souza conhece cada cartório da região"
                highlight="cada cartório"
              />
            </Reveal>

            <div className="mt-8 space-y-5">
              {authorityPoints.map((point, i) => {
                const Icon = icons[i];
                return (
                  <Reveal key={point.title} delay={i * 80}>
                    <div
                      className="flex gap-4 rounded-2xl border p-5"
                      style={{ borderColor: C.border, backgroundColor: C.surface }}
                    >
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: "rgba(5,150,105,.1)", color: C.brand }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ fontFamily: F.heading, color: C.text }}>
                          {point.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed" style={{ fontFamily: F.body, color: C.muted }}>
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={180}>
              <p className="mt-6 text-sm leading-relaxed" style={{ fontFamily: F.body, color: C.muted }}>
                Lidera a NorteGeo com equipe de campo própria, equipamentos de última geração
                e rede de parceiros jurídicos. Missão: eliminar a burocracia que separa você
                do documento da sua terra.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ fontFamily: F.label, backgroundColor: C.whatsapp }}
                >
                  Falar com Sócrates
                  <ArrowRight size={16} />
                </a>
                <a
                  href="mailto:contato@nortegeo.com.br"
                  className="inline-flex items-center rounded-xl border px-6 py-3 text-sm font-semibold transition hover:bg-slate-50"
                  style={{ fontFamily: F.label, borderColor: C.border, color: C.textSoft }}
                >
                  contato@nortegeo.com.br
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
