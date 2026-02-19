import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";

function MondayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="14" cy="26" r="5" fill="currentColor" opacity="0.5" />
      <circle cx="30" cy="18" r="5" fill="currentColor" opacity="0.75" />
      <circle cx="46" cy="10" r="5" fill="currentColor" />
      <text x="62" y="27" fontFamily="Inter, sans-serif" fontSize="17" fontWeight="700" fill="currentColor" letterSpacing="-0.5">monday.com</text>
    </svg>
  );
}

function MonsterLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 30V10l9 11 9-11v20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="34" y="26" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="800" fill="currentColor" letterSpacing="2">MONSTER</text>
    </svg>
  );
}

function CitizenMLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <text x="0" y="26" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="600" fill="currentColor" letterSpacing="-0.5">citizen</text>
      <text x="88" y="26" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="900" fill="currentColor" letterSpacing="-0.5">M</text>
    </svg>
  );
}

function CalPolyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10 36c2-10 6-16 10-20 2-2 5-2 6 1s-2 6-4 8c4-4 8-6 10-4s-2 8-6 12l4 3" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="44" y="21" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="800" fill="currentColor" letterSpacing="2">CAL POLY</text>
      <text x="44" y="35" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="500" fill="currentColor" letterSpacing="2.5" opacity="0.65">SAN LUIS OBISPO</text>
    </svg>
  );
}

function HarvardLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 4h24v24c0 7-12 12-12 12S6 35 6 28V4z" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <line x1="6" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="6" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="18" y1="4" x2="18" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <text x="40" y="20" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="currentColor" letterSpacing="2">HARVARD</text>
      <text x="40" y="35" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" fill="currentColor" letterSpacing="1.5" opacity="0.65">BUSINESS SCHOOL</text>
    </svg>
  );
}

function ColumbiaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 30l5-18 5 9 5-9 5 9 5-9 5 18H8z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <line x1="8" y1="34" x2="38" y2="34" stroke="currentColor" strokeWidth="1.8" />
      <text x="48" y="20" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="currentColor" letterSpacing="2">COLUMBIA</text>
      <text x="48" y="35" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" fill="currentColor" letterSpacing="1.5" opacity="0.65">BUSINESS SCHOOL</text>
    </svg>
  );
}

interface Brand {
  name: string;
  Logo: React.FC<{ className?: string }>;
  width: string;
}

const brands: Brand[] = [
  { name: "monday.com", Logo: MondayLogo, width: "w-[160px] md:w-[185px]" },
  { name: "Monster", Logo: MonsterLogo, width: "w-[140px] md:w-[165px]" },
  { name: "citizenM", Logo: CitizenMLogo, width: "w-[120px] md:w-[140px]" },
  { name: "Cal Poly", Logo: CalPolyLogo, width: "w-[155px] md:w-[175px]" },
  {
    name: "Harvard Business School",
    Logo: HarvardLogo,
    width: "w-[180px] md:w-[210px]",
  },
  {
    name: "Columbia Business School",
    Logo: ColumbiaLogo,
    width: "w-[180px] md:w-[210px]",
  },
];

export function BrandsSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-['Inter'] text-[12px] tracking-[0.16em] uppercase text-[#888] mb-4">
            Collaborations
          </p>
          <h2 className="font-['Playfair_Display'] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.2] tracking-[-0.02em] text-[#0a0a0a]">
            Brands &amp; Organizations I've Worked With
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-[900px] mx-auto">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className="group flex items-center justify-center h-[100px] md:h-[120px] rounded-2xl border border-[#eee] bg-white hover:border-[#ccc] hover:shadow-sm transition-all duration-400"
            >
              <brand.Logo
                className={`${brand.width} h-auto text-[#b0b0b0] group-hover:text-[#333] transition-colors duration-300`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
