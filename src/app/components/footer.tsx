const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@torytrombley.com" },
];

const siteLinks = [
  { label: "About", href: "#about" },
  { label: "Insights", href: "#content" },
  { label: "Speaking", href: "#speaking" },
  { label: "Advisory", href: "#consulting" },
  { label: "Newsletter", href: "#newsletter" },
];

export function Footer() {
  return (
    <footer className="py-16 md:py-20 bg-[#0a0a0a]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-12 md:gap-8 mb-16">
          <div>
            <a
              href="#"
              className="font-['Playfair_Display'] text-[22px] tracking-[-0.02em] text-white mb-4 block"
            >
              Tory Trombley
            </a>
            <p className="font-['Inter'] text-[14px] leading-[1.7] text-[#666] max-w-[320px]">
              AI-first product leader, creator, and strategic advisor shaping how teams build in the age of AI.
            </p>
          </div>

          <div>
            <p className="font-['Inter'] text-[11px] tracking-[0.12em] uppercase text-[#555] mb-5">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              {siteLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-['Inter'] text-[14px] text-[#888] hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-['Inter'] text-[11px] tracking-[0.12em] uppercase text-[#555] mb-5">
              Connect
            </p>
            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Inter'] text-[14px] text-[#888] hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['Inter'] text-[12px] text-[#555]">
            &copy; {new Date().getFullYear()} Tory Trombley. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Inter'] text-[11px] tracking-[0.08em] uppercase text-[#444] hover:text-[#888] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
