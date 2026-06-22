import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqItems } from "@/content/home";
import { Reveal, SectionTitle } from "@/components/EditorialHeading";
import { C, F } from "@/lib/brand";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28" style={{ backgroundColor: C.surface }}>
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Reveal>
          <SectionTitle
            badge="Tire suas dúvidas"
            title="Perguntas que todo mundo faz"
            highlight="todo mundo"
            align="center"
          />
        </Reveal>

        <div className="mt-10 space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.question} delay={i * 40}>
                <div
                  className="overflow-hidden rounded-2xl border transition"
                  style={{
                    backgroundColor: C.white,
                    borderColor: isOpen ? C.brand : C.border,
                    boxShadow: isOpen ? `0 0 0 1px ${C.brand}` : undefined,
                  }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className="text-sm font-semibold md:text-base"
                      style={{ fontFamily: F.heading, color: C.text, lineHeight: 1.35 }}
                    >
                      {item.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      style={{ color: C.brand }}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="px-5 pb-5 text-sm leading-relaxed"
                        style={{ fontFamily: F.body, color: C.muted }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
