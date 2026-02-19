import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { Mic, Users, Lightbulb, Rocket } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const topics = [
  {
    icon: Mic,
    title: "AI-First Product Management",
    description:
      "How product teams can embrace AI tools at every stage — from research to launch — and build faster without sacrificing quality.",
  },
  {
    icon: Users,
    title: "Vibe Coding for Product Teams",
    description:
      "A hands-on workshop on using AI-assisted coding to rapidly prototype, test, and iterate on product ideas.",
  },
  {
    icon: Lightbulb,
    title: "Product Storytelling in the AI Era",
    description:
      "Crafting compelling narratives for AI-powered products that resonate with users, stakeholders, and investors.",
  },
  {
    icon: Rocket,
    title: "Creator-First Thinking Inside Big Tech",
    description:
      "Lessons from building creator tools at Instagram and what product orgs can learn from the creator economy.",
  },
];

export function SpeakingSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="speaking" className="py-28 md:py-36 bg-[#fafafa]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-20 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <p className="font-['Inter'] text-[12px] tracking-[0.16em] uppercase text-[#888] mb-4">
                Speaking & Workshops
              </p>
              <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.2] tracking-[-0.02em] text-[#0a0a0a] mb-6">
                Bringing AI-first thinking to stages and teams worldwide.
              </h2>
              <p className="font-['Inter'] text-[15px] leading-[1.8] text-[#555] mb-8">
                I speak at conferences, lead workshops, and run private sessions for product organizations navigating the shift to AI-native workflows. My talks are practical, insight-driven, and built for leaders who want to move faster.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwc3BlYWtpbmclMjBzdGFnZSUyMGtleW5vdGV8ZW58MXx8fHwxNzcxNDM1NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Speaking at conference"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.a
              href="mailto:hello@torytrombley.com?subject=Speaking%20Inquiry"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center font-['Inter'] text-[14px] tracking-[0.02em] px-7 py-3.5 bg-[#0a0a0a] text-white rounded-full hover:bg-[#222] transition-all duration-300 hover:shadow-lg hover:shadow-black/10"
            >
              Invite Me to Speak
            </motion.a>
          </div>

          <div className="space-y-5 md:pt-16">
            {topics.map((topic, i) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.12 * i + 0.2 }}
                className="group p-6 rounded-2xl border border-[#eee] bg-white hover:border-[#ccc] hover:shadow-sm transition-all duration-400"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#f5f5f5] flex items-center justify-center group-hover:bg-[#0a0a0a] transition-colors duration-300">
                    <topic.icon
                      size={18}
                      className="text-[#555] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-['Inter'] text-[15px] text-[#0a0a0a] mb-1.5">
                      {topic.title}
                    </h3>
                    <p className="font-['Inter'] text-[14px] leading-[1.7] text-[#777]">
                      {topic.description}
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
