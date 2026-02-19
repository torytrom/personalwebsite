import { useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { Check, ChevronDown } from "lucide-react";

const toryAvatar = "/assets/tory-photo.png";

const reachOutOptions = [
  "Sponsored Content",
  "Creative Partnership",
  "Product Launch",
  "Speaking Engagement",
  "Advisory / Consulting",
  "Other",
];

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcTNo0EPcRzt2jLPj37znhmWtTLfULi7GvO0U3HxT4JP6T4hYbzgPYnx7guVQsk5tc/exec";

export function NewsletterSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    role: "",
    reason: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitting(true);
    setError(false);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        companyWebsite: formData.website,
        role: formData.role,
        reason: formData.reason,
        message: formData.message,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      };

      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full font-['Inter'] text-[14px] px-4 py-3 rounded-lg bg-[#f5f5f5] border border-transparent focus:border-[#ccc] focus:bg-white focus:outline-none transition-all duration-300 placeholder:text-[#aaa]";
  const labelClass =
    "block font-['Inter'] text-[12px] tracking-[0.01em] text-[#555] mb-1.5";

  return (
    <section
      id="newsletter"
      className="py-28 md:py-36 bg-[#fafafa]"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-['Inter'] text-[13px] tracking-[0.02em] text-[#333] border border-[#ddd] rounded-full px-4 py-1.5 mb-8">
              Contact
            </span>

            <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.15] tracking-[-0.02em] text-[#0a0a0a] mb-6">
              Want to work together?
            </h2>

            <p className="font-['Inter'] text-[15px] leading-[1.7] text-[#777] mb-12 max-w-[440px]">
              If you're a brand looking to collaborate — through sponsored
              content, creative partnerships, or other ideas — use the
              button below.
            </p>

            <div className="flex items-center gap-4">
              <img
                src={toryAvatar}
                alt="Tory Trombley"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <p className="font-['Inter'] text-[13px] leading-[1.55] text-[#666] max-w-[280px]">
                All submissions are reviewed by my team (and sometimes by me!)
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl bg-white border border-[#eee]">
                <div className="w-14 h-14 rounded-full bg-[#1a1a6e] flex items-center justify-center">
                  <Check size={24} className="text-white" />
                </div>
                <p className="font-['Playfair_Display'] text-[20px] text-[#0a0a0a]">
                  Message sent!
                </p>
                <p className="font-['Inter'] text-[14px] text-[#888]">
                  We'll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Name:
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email:
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-website" className={labelClass}>
                      Company Website:
                    </label>
                    <input
                      id="contact-website"
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Link here..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-role" className={labelClass}>
                      Your Role:
                    </label>
                    <input
                      id="contact-role"
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Text..."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-reason" className={labelClass}>
                    What are you reaching out about?
                  </label>
                  <div className="relative">
                    <select
                      id="contact-reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select...
                      </option>
                      {reachOutOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Message:
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={4}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                {error && (
                  <p className="font-['Inter'] text-[13px] text-red-500 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-['Inter'] text-[15px] tracking-[0.02em] py-3.5 bg-[#1a1a6e] text-white rounded-full hover:bg-[#14145a] transition-all duration-300 hover:shadow-lg hover:shadow-[#1a1a6e]/20 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Submit"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
