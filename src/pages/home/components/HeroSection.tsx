import { ChevronRight, ArrowDown, MapPin, Shield, Zap } from "lucide-react";
import { heroBadges, WHATSAPP_URL, stats } from "@/content/home";
import { Reveal } from "@/components/EditorialHeading";
import { C, F, gradient, asset } from "@/lib/brand";

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen overflow-hidden"
      style={{ background: gradient.hero }}
    >
      {/* Grid + mesh */}
      <div className="absolute inset-0 grid-pattern-dark opacity-60" />
      <div className="absolute inset-0" style={{ background: gradient.mesh }} />

      {/* Banner — direita */}
      <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <div
          className="absolute inset-4 overflow-hidden rounded-3xl"
          style={{ boxShadow: "0 32px 64px rgba(0,0,0,.4)" }}
        >
          <img
            src={asset("assets/hero-banner.png")}
            alt="Equipe NorteGeo em campo"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to left, transparent 40%, ${C.navy900} 100%)` }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 pb-12 pt-24 lg:px-8 lg:pt-28">
        <div className="flex min-h-[calc(100vh-7rem)] flex-col justify-center lg:max-w-[52%]">
          <Reveal>
            <BadgeRow />
          </Reveal>

          <Reveal delay={80}>
            <h1
              className="mt-6 font-extrabold tracking-tight"
              style={{
                fontFamily: F.heading,
                fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
                lineHeight: 1.08,
                color: C.white,
              }}
            >
              Sua terra vira{" "}
              <span className="text-gradient">patrimônio</span>
              <br />
              sem burocracia
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p
              className="mt-6 max-w-lg text-base leading-relaxed md:text-lg"
              style={{ fontFamily: F.body, color: "rgba(255,255,255,.7)" }}
            >
              Da estaca no terreno ao documento no cartório — ecossistema completo
              de topografia, regularização fundiária e assessoria jurídica no Norte do ES.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[.98]"
                style={{
                  fontFamily: F.label,
                  background: gradient.brand,
                  boxShadow: `0 4px 24px ${C.brandGlow}`,
                }}
              >
                Quero regularizar minha terra
                <ChevronRight size={17} className="transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#problema"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border px-7 text-sm font-semibold transition hover:bg-white/5"
                style={{
                  fontFamily: F.label,
                  borderColor: "rgba(255,255,255,.2)",
                  color: "rgba(255,255,255,.85)",
                }}
              >
                Como funciona <ArrowDown size={15} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap gap-2">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="glass rounded-full px-3.5 py-1.5 text-xs font-medium"
                  style={{ fontFamily: F.label, color: "rgba(255,255,255,.8)" }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Mini stats flutuantes */}
          <Reveal delay={400}>
            <div className="mt-12 grid grid-cols-3 gap-3 sm:max-w-md">
              {stats.slice(0, 3).map((s) => (
                <div
                  key={s.label}
                  className="glass rounded-2xl px-4 py-3"
                >
                  <p
                    className="text-xl font-bold"
                    style={{ fontFamily: F.heading, color: C.brandLight }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="mt-0.5 text-[10px] font-medium leading-tight"
                    style={{ color: "rgba(255,255,255,.55)" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Mobile banner */}
      <div className="relative mx-5 mb-8 overflow-hidden rounded-2xl lg:hidden">
        <img
          src={asset("assets/hero-banner.png")}
          alt="Equipe NorteGeo"
          className="aspect-[16/10] w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${C.navy900}, transparent 60%)` }}
        />
      </div>
    </section>
  );
}

function BadgeRow() {
  const items = [
    { Icon: MapPin, text: "Norte do ES" },
    { Icon: Shield, text: "CREA-ES · INCRA" },
    { Icon: Zap, text: "Resposta em 24h" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ Icon, text }) => (
        <span
          key={text}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{
            backgroundColor: "rgba(52,211,153,.1)",
            color: C.brandLight,
            border: "1px solid rgba(52,211,153,.2)",
          }}
        >
          <Icon size={12} />
          {text}
        </span>
      ))}
    </div>
  );
}
