import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { Play } from "lucide-react";

interface VideoItem {
  id: number;
  title: string;
  descriptor: string;
  poster: string;
  video: string;
}

const videoItems: VideoItem[] = [
  {
    id: 1,
    title: "AI-First Product Thinking",
    descriptor: "How AI reshapes every stage of the product lifecycle",
    poster:
      "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMEFJJTIwdGVjaG5vbG9neSUyMG5ldXJhbCUyMG5ldHdvcmslMjBkYXJrfGVufDF8fHx8MTc3MTMzMDU2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    video:
      "https://tsbeszszrrxfaootaokf.supabase.co/storage/v1/object/public/videos%20for%20website/3f148009dcaa4e08ac74e61f0cfcb21f.mov",
  },
  {
    id: 2,
    title: "The Future of Creative Tools",
    descriptor: "Building products that serve millions of creators",
    poster:
      "https://images.unsplash.com/photo-1752253604157-65fb42c30816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwZGlnaXRhbCUyMGludGVyZmFjZSUyMGhvbG9ncmFwaGljfGVufDF8fHx8MTc3MTQ1MDI2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    video:
      "https://tsbeszszrrxfaootaokf.supabase.co/storage/v1/object/public/videos%20for%20website/2360CB02-E6F7-4A3E-81E1-87799549C0D5.mov",
  },
  {
    id: 3,
    title: "Navigating AI Disruption",
    descriptor: "What product leaders need to know right now",
    poster:
      "https://images.unsplash.com/photo-1542744094-24638eff58bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGJyYWluc3Rvcm0lMjB3aGl0ZWJvYXJkJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzcxNDUwMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    video:
      "https://tsbeszszrrxfaootaokf.supabase.co/storage/v1/object/public/videos%20for%20website/7476D403-1564-4A66-8856-FF7F32F9AB42.mov",
  },
  {
    id: 4,
    title: "Building in Public",
    descriptor: "Sharing mental models and behind-the-scenes insights",
    poster:
      "https://images.unsplash.com/photo-1764874299006-bf4266427ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25mZXJlbmNlJTIwa2V5bm90ZSUyMHN0YWdlJTIwc3BlYWtlcnxlbnwxfHx8fDE3NzE0NTAyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    video:
      "https://tsbeszszrrxfaootaokf.supabase.co/storage/v1/object/public/videos%20for%20website/b576310d5b114fda82cab62ea6cccd81.mov",
  },
  {
    id: 5,
    title: "Vibe Coding in Practice",
    descriptor: "From idea to working prototype in hours, not quarters",
    poster:
      "https://images.unsplash.com/photo-1634836023845-eddbfe9937da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjb2RpbmclMjBsYXB0b3AlMjBkYXJrJTIwd29ya3NwYWNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzE0NTAyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    video:
      "https://tsbeszszrrxfaootaokf.supabase.co/storage/v1/object/public/videos%20for%20website/621d9b84869a493198b1ec99e116b128.mov",
  },
  {
    id: 6,
    title: "Product × Creator Mindset",
    descriptor: "Why the best PMs think like creators",
    poster:
      "https://images.unsplash.com/photo-1764406562219-105937cc3f95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBwcm9kdWN0JTIwZGVzaWduJTIwc2NyZWVuJTIwbW9ja3VwfGVufDF8fHx8MTc3MTQ1MDI2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    video:
      "https://tsbeszszrrxfaootaokf.supabase.co/storage/v1/object/public/videos%20for%20website/v15044gf0000d5sdp9fog65lknonjqc0.mov",
  },
];

function VideoTile({
  item,
  isInView,
}: {
  item: VideoItem;
  isInView: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = item.video.length > 0;

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;
    video.play().catch(() => {});
  }, [hasVideo]);

  useEffect(() => {
    if (isInView) tryPlay();
  }, [isInView, tryPlay]);

  return (
    <div className="group cursor-pointer flex-shrink-0 w-[220px] sm:w-[250px] md:w-[280px]">
      <div className="relative aspect-[9/16] rounded-[16px] overflow-hidden bg-[#111] shadow-[0_4px_24px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.14)] transition-shadow duration-500">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={item.video}
            poster={item.poster}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full overflow-hidden">
            <img
              src={item.poster}
              alt={item.title}
              className="w-full h-full object-cover animate-[kenburns_20s_ease-in-out_infinite_alternate]"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 via-40% to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} className="text-[#0a0a0a] ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedVideosSection() {
  const { ref, isInView } = useInView({ threshold: 0.06 });
  const [isPaused, setIsPaused] = useState(false);

  const duplicatedItems = [...videoItems, ...videoItems];

  return (
    <section id="content" className="py-28 md:py-36 bg-[#fafafa]" ref={ref}>
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1%, -1%); }
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-20"
        >
          <p className="font-['Inter'] text-[12px] tracking-[0.16em] uppercase text-[#888] mb-4">
            Featured Videos
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.2] tracking-[-0.02em] text-[#0a0a0a] max-w-[600px]">
              Ideas on AI, product, and the future of creative work.
            </h2>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-r from-[#fafafa] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 bg-gradient-to-l from-[#fafafa] to-transparent pointer-events-none" />

        <div
          className="flex gap-5 md:gap-6 w-max"
          style={{
            animation: `marquee-scroll 60s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {duplicatedItems.map((item, i) => (
            <VideoTile
              key={`${item.id}-${i}`}
              item={item}
              isInView={isInView}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
