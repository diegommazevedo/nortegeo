import { Star, Quote } from "lucide-react";
import { testimonials } from "@/content/home";
import { Reveal, SectionTitle } from "@/components/EditorialHeading";
import { C, F, gradient } from "@/lib/brand";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: gradient.hero }}
    >
      <div className="absolute inset-0 grid-pattern-dark opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionTitle
              badge="Quem já resolveu"
              title="A palavra de quem saiu da burocracia"
              highlight="saiu da burocracia"
              dark
            />
          </Reveal>
          <Reveal delay={100}>
            <div
              className="inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5"
              style={{
                backgroundColor: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.12)",
              }}
            >
              <div className="flex gap-0.5 text-yellow-400">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: F.label, color: "rgba(255,255,255,.8)" }}
              >
                5.0 Google Reviews
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <blockquote
                className="flex h-full flex-col rounded-2xl border p-6 transition hover:-translate-y-1"
                style={{
                  backgroundColor: "rgba(255,255,255,.05)",
                  borderColor: "rgba(255,255,255,.1)",
                }}
              >
                <Quote size={24} style={{ color: C.brandLight, opacity: 0.5 }} />
                <p
                  className="mt-4 flex-1 text-sm leading-relaxed"
                  style={{ fontFamily: F.body, color: "rgba(255,255,255,.75)" }}
                >
                  "{item.quote}"
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: "rgba(255,255,255,.08)" }}>
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: C.brand, color: C.white }}
                  >
                    {initials(item.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ fontFamily: F.label, color: C.white }}>
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ fontFamily: F.body, color: "rgba(255,255,255,.5)" }}>
                      {item.role}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
