import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Insights", href: "#content" },
  { label: "Speaking", href: "#speaking" },
  { label: "Advisory", href: "#consulting" },
  { label: "Contact", href: "#newsletter" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 flex items-center justify-between h-[72px]">
          <a
            href="#"
            className="font-['Playfair_Display'] text-[20px] tracking-[-0.02em] text-[#0a0a0a]"
          >
            Tory Trombley
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-['Inter'] text-[13px] tracking-[0.06em] uppercase text-[#555] hover:text-[#0a0a0a] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#newsletter"
            className="hidden md:inline-flex font-['Inter'] text-[13px] tracking-[0.04em] px-5 py-2.5 bg-[#0a0a0a] text-white rounded-full hover:bg-[#222] transition-colors duration-300"
          >
            Work With Me
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#0a0a0a]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-[72px]"
          >
            <div className="flex flex-col items-center gap-8 pt-12">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-['Inter'] text-[15px] tracking-[0.06em] uppercase text-[#333] hover:text-[#0a0a0a] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#newsletter"
                onClick={() => setMobileOpen(false)}
                className="mt-4 font-['Inter'] text-[14px] tracking-[0.04em] px-8 py-3 bg-[#0a0a0a] text-white rounded-full"
              >
                Work With Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
