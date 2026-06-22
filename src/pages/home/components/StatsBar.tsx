import { credentials, stats } from "@/content/home";
import { Reveal } from "@/components/EditorialHeading";
import { C, F, gradient } from "@/lib/brand";
import { Award, CheckCircle2 } from "lucide-react";

export default function StatsBar() {
  return (
    <section
      className="relative overflow-hidden py-16 lg:py-20"
      style={{ background: gradient.hero }}
    >
      <div className="absolute inset-0 grid-pattern-dark opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, i) => (
            <Reveal key={item.label} delay={i * 60}>
              <div
                className="glass rounded-2xl p-6 text-center lg:text-left"
              >
                <p
                  className="text-4xl font-extrabold tracking-tight md:text-5xl"
                  style={{ fontFamily: F.heading, color: C.brandLight }}
                >
                  {item.value}
                </p>
                <p
                  className="mt-1.5 text-sm font-medium"
                  style={{ fontFamily: F.body, color: "rgba(255,255,255,.6)" }}
                >
                  {item.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {credentials.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                style={{
                  fontFamily: F.label,
                  backgroundColor: "rgba(52,211,153,.1)",
                  color: C.brandLight,
                  border: "1px solid rgba(52,211,153,.2)",
                }}
              >
                <CheckCircle2 size={13} />
                {item}
              </span>
            ))}
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
              style={{
                backgroundColor: "rgba(37,99,235,.12)",
                color: C.accentLight,
                border: "1px solid rgba(37,99,235,.25)",
              }}
            >
              <Award size={13} />
              98% taxa de aprovação
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
