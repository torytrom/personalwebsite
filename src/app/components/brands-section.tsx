import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";

function MondayLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="28" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="28" cy="20" r="4" fill="currentColor" opacity="0.85" />
      <circle cx="44" cy="12" r="4" fill="currentColor" />
      <text
        x="60"
        y="28"
        fontFamily="Inter, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        monday.com
      </text>
    </svg>
  );
}

function MonsterLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 32V14l10 12 10-12v18"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text
        x="36"
        y="28"
        fontFamily="Inter, sans-serif"
        fontSize="18"
        fontWeight="800"
        fill="currentColor"
        letterSpacing="1"
        textTransform="uppercase"
      >
        MONSTER
      </text>
    </svg>
  );
}

function CitizenMLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 170 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="4"
        y="28"
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        citizen
      </text>
      <text
        x="103"
        y="28"
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="900"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        M
      </text>
    </svg>
  );
}

function CalPolyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 34 C8 22, 14 16, 18 14 C20 13, 22 14, 22 16 C22 18, 20 20, 18 22 C24 18, 28 16, 30 18 C32 20, 28 26, 24 30 L30 34"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="40"
        y="22"
        fontFamily="Inter, sans-serif"
        fontSize="14"
        fontWeight="800"
        fill="currentColor"
        letterSpacing="1.5"
      >
        CAL POLY
      </text>
      <text
        x="40"
        y="36"
        fontFamily="Inter, sans-serif"
        fontSize="9"
        fontWeight="500"
        fill="currentColor"
        letterSpacing="2"
        opacity="0.7"
      >
        SAN LUIS OBISPO
      </text>
    </svg>
  );
}

function HarvardLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 6h20v22c0 6-10 10-10 10S8 34 8 28V6z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <text
        x="12"
        y="17"
        fontFamily="serif"
        fontSize="6"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="0.5"
      >
        VE RI
      </text>
      <text
        x="14"
        y="26"
        fontFamily="serif"
        fontSize="6"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="0.5"
      >
        TAS
      </text>
      <text
        x="40"
        y="20"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="1.5"
      >
        HARVARD
      </text>
      <text
        x="40"
        y="34"
        fontFamily="Inter, sans-serif"
        fontSize="9"
        fontWeight="500"
        fill="currentColor"
        letterSpacing="1"
        opacity="0.7"
      >
        BUSINESS SCHOOL
      </text>
    </svg>
  );
}

function ColumbiaLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 165 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 28l4-16 6 8 6-8 6 8 6-8 4 16H6z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      <line
        x1="6"
        y1="31"
        x2="38"
        y2="31"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <text
        x="48"
        y="20"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="1.5"
      >
        COLUMBIA
      </text>
      <text
        x="48"
        y="34"
        fontFamily="Inter, sans-serif"
        fontSize="9"
        fontWeight="500"
        fill="currentColor"
        letterSpacing="1"
        opacity="0.7"
      >
        BUSINESS SCHOOL
      </text>
    </svg>
  );
}

interface Brand {
  name: string;
  Logo: React.FC<{ className?: string }>;
  width: string;
}

const brands: Brand[] = [
  { name: "monday.com", Logo: MondayLogo, width: "w-[160px] md:w-[190px]" },
  { name: "Monster", Logo: MonsterLogo, width: "w-[150px] md:w-[175px]" },
  { name: "citizenM", Logo: CitizenMLogo, width: "w-[140px] md:w-[160px]" },
  { name: "Cal Poly", Logo: CalPolyLogo, width: "w-[155px] md:w-[175px]" },
  {
    name: "Harvard Business School",
    Logo: HarvardLogo,
    width: "w-[200px] md:w-[240px]",
  },
  {
    name: "Columbia Business School",
    Logo: ColumbiaLogo,
    width: "w-[200px] md:w-[240px]",
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
