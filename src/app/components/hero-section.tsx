import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

const toryPhoto = "/assets/tory-photo.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,0,0,0.02)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 w-full pt-[100px] pb-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-['Inter'] text-[12px] tracking-[0.16em] uppercase text-[#888] mb-6">
                Product Leader &middot; AI Strategist &middot; Creator
              </p>
              <h1 className="font-['Playfair_Display'] text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] text-[#0a0a0a] mb-6">
                Tory Trombley
              </h1>
              <p className="font-['Inter'] text-[clamp(1rem,1.8vw,1.2rem)] leading-[1.7] text-[#555] max-w-[480px] mb-4">
                Exploring how AI is reshaping product development, creativity, and the way modern teams build.
              </p>
              <p className="font-['Inter'] text-[15px] leading-[1.7] text-[#888] max-w-[440px] mb-10">
                Product at Instagram. Thought leader on AI-first workflows, vibe coding, and the future of creative work.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#newsletter"
                className="inline-flex items-center font-['Inter'] text-[14px] tracking-[0.02em] px-7 py-3.5 bg-[#0a0a0a] text-white rounded-full hover:bg-[#222] transition-all duration-300 hover:shadow-lg hover:shadow-black/10"
              >
                Work With Me
              </a>
              <a
                href="#content"
                className="inline-flex items-center font-['Inter'] text-[14px] tracking-[0.02em] px-7 py-3.5 border border-[#ddd] text-[#333] rounded-full hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all duration-300"
              >
                Explore Content
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 md:order-2 relative"
          >
            <div className="relative aspect-[3/4] max-w-[450px] mx-auto md:ml-auto rounded-[20px] overflow-hidden shadow-2xl shadow-black/10">
              <img
                src={toryPhoto}
                alt="Tory Trombley"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-[#e0e0e0] rounded-[16px] -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#f0f0f0] rounded-full -z-10" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden md:flex justify-center mt-20"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-[#aaa] hover:text-[#555] transition-colors"
          >
            <span className="font-['Inter'] text-[11px] tracking-[0.12em] uppercase">Scroll</span>
            <ArrowDown size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
