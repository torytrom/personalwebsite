import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { Sparkles, Layers, Zap, Eye } from "lucide-react";

const pillars = [
  {
    icon: Sparkles,
    title: "AI-First Product Strategy",
    description:
      "Pioneering how AI reshapes every stage of the product lifecycle — from ideation to shipping.",
  },
  {
    icon: Layers,
    title: "Vibe Coding & Rapid Prototyping",
    description:
      "Turning ideas into working prototypes in hours, not quarters. Building in public and sharing the process.",
  },
  {
    icon: Zap,
    title: "Creative Tools at Scale",
    description:
      "Leading creative tools at Edits for Instagram, shaping how millions of creators make content.",
  },
  {
    icon: Eye,
    title: "Public Thought Leadership",
    description:
      "Translating complex industry shifts into clear mental models for product teams and executives.",
  },
];

export function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section id="about" className="py-28 md:py-36 bg-white" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-['Inter'] text-[12px] tracking-[0.16em] uppercase text-[#888] mb-4"
        >
          About
        </motion.p>

        <div className="grid md:grid-cols-[1.1fr_1fr] gap-16 md:gap-24">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.2] tracking-[-0.02em] text-[#0a0a0a] mb-8"
            >
              Shaping how the industry thinks about AI in product development.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-5"
            >
              <p className="font-['Inter'] text-[15px] leading-[1.8] text-[#555]">
                I'm a Product Manager at Instagram, where I build the creative tools that shape how people express themselves online. My work sits at the intersection of AI, product strategy, and creator culture — and I've spent years learning what it takes to ship products that matter at massive scale.
              </p>
              <p className="font-['Inter'] text-[15px] leading-[1.8] text-[#555]">
                I was an early adopter of AI-assisted workflows and what's now called "vibe coding" — using AI tools to move from concept to working prototype in hours instead of weeks. This isn't theoretical for me. I apply these methods inside one of the world's largest product organizations every day.
              </p>
              <p className="font-['Inter'] text-[15px] leading-[1.8] text-[#555]">
                As a creator, I translate those lessons publicly — sharing mental models, frameworks, and behind-the-scenes insights with a growing audience of product leaders, engineers, and aspiring builders. I'm known for making complex shifts in AI and product development feel clear, actionable, and human.
              </p>
              <p className="font-['Inter'] text-[15px] leading-[1.8] text-[#444]">
                My goal is simple: bridge the gap between big tech execution and public learning, so more people can build smarter, ship faster, and navigate the AI era with confidence.
              </p>
            </motion.div>
          </div>

          <div className="space-y-6 md:pt-12">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i + 0.3 }}
                className="group p-6 rounded-2xl border border-[#eee] hover:border-[#ccc] hover:shadow-sm transition-all duration-400 bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#f5f5f5] flex items-center justify-center group-hover:bg-[#0a0a0a] transition-colors duration-300">
                    <pillar.icon
                      size={18}
                      className="text-[#555] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-['Inter'] text-[15px] text-[#0a0a0a] mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="font-['Inter'] text-[14px] leading-[1.7] text-[#777]">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
