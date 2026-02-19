import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import {
  TrendingUp,
  Building2,
  RefreshCw,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const focusAreas = [
  {
    icon: TrendingUp,
    title: "AI-First Product Strategy",
    description:
      "Helping product organizations adopt AI-native workflows that accelerate time-to-market and unlock new capabilities.",
  },
  {
    icon: Building2,
    title: "Organizational AI Adaptation",
    description:
      "Guiding leadership teams through the structural and cultural shifts required to become an AI-first organization.",
  },
  {
    icon: RefreshCw,
    title: "Workflow Redesign for AI Teams",
    description:
      "Redesigning product development processes around AI tools — from vibe coding to AI-assisted research and decision-making.",
  },
  {
    icon: BarChart3,
    title: "Market Trends & Emerging Shifts",
    description:
      "Advising investors and executives on how AI tools, vibe coding, and creator behavior are reshaping the product landscape.",
  },
];

const audiences = [
  "Investors evaluating AI product opportunities",
  "Product organizations modernizing workflows",
  "Leadership teams navigating AI disruption",
  "Tech companies rethinking product development",
];

export function ConsultingSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="consulting" className="py-28 md:py-36 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <p className="font-['Inter'] text-[12px] tracking-[0.16em] uppercase text-[#666] mb-4">
            Advisory & Consulting
          </p>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16">
            <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.2] tracking-[-0.02em] text-white">
              Strategic guidance for organizations & investors navigating the AI transformation.
            </h2>
            <div className="md:pt-2">
              <p className="font-['Inter'] text-[15px] leading-[1.8] text-[#999]">
                I work with investors, product teams, and leadership to demystify the rapid shifts happening in AI-first product development. My perspective comes from building inside one of the world's largest platforms — not from theory, but from practice.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {focusAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i + 0.2 }}
              className="group p-7 rounded-2xl border border-[#222] bg-[#111] hover:border-[#333] hover:bg-[#151515] transition-all duration-400"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#222] flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                  <area.icon
                    size={19}
                    className="text-[#888] group-hover:text-[#0a0a0a] transition-colors duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-['Inter'] text-[15px] text-white mb-2">
                    {area.title}
                  </h3>
                  <p className="font-['Inter'] text-[14px] leading-[1.7] text-[#777]">
                    {area.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 pt-10 border-t border-[#222]"
        >
          <div>
            <p className="font-['Inter'] text-[12px] tracking-[0.12em] uppercase text-[#666] mb-5">
              Who I work with
            </p>
            <div className="flex flex-wrap gap-3">
              {audiences.map((audience) => (
                <span
                  key={audience}
                  className="font-['Inter'] text-[13px] text-[#999] px-4 py-2 rounded-full border border-[#222] bg-[#111]"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>

          <a
            href="mailto:hello@torytrombley.com?subject=Consulting%20Inquiry"
            className="flex-shrink-0 inline-flex items-center gap-2 font-['Inter'] text-[14px] tracking-[0.02em] px-8 py-4 bg-white text-[#0a0a0a] rounded-full hover:bg-[#f0f0f0] transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
          >
            Discuss Consulting Opportunities
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
