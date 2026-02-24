import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/use-in-view";
import { Play } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface VideoItem {
  id: number;
  title: string;
  descriptor: string;
  /** Filename inside the "videos for website" bucket (no full URL). */
  videoPath: string;
}

// ── Video data (paths only — signed URLs are fetched at runtime) ──────────────
const videoItems: VideoItem[] = [
  {
    id: 1,
    title: "AI-First Product Thinking",
    descriptor: "How AI reshapes every stage of the product lifecycle",
    videoPath: "3f148009dcaa4e08ac74e61f0cfcb21f.mov",
  },
  {
    id: 2,
    title: "The Future of Creative Tools",
    descriptor: "Building products that serve millions of creators",
    videoPath: "2360CB02-E6F7-4A3E-81E1-87799549C0D5.mov",
  },
  {
    id: 3,
    title: "Navigating AI Disruption",
    descriptor: "What product leaders need to know right now",
    videoPath: "7476D403-1564-4A66-8856-FF7F32F9AB42.mov",
  },
  {
    id: 4,
    title: "Building in Public",
    descriptor: "Sharing mental models and behind-the-scenes insights",
    videoPath: "b576310d5b114fda82cab62ea6cccd81.mov",
  },
  {
    id: 5,
    title: "Vibe Coding in Practice",
    descriptor: "From idea to working prototype in hours, not quarters",
    videoPath: "621d9b84869a493198b1ec99e116b128.mov",
  },
];

// ── Signed-URL cache (module-level, survives re-renders) ──────────────────────
const SIGNED_URL_TTL_MS = 10 * 60 * 1000; // 10 min — matches server-side expiry
const REFRESH_BUFFER_MS = 2 * 60 * 1000; // refresh 2 min before expiry

interface CacheEntry {
  url: string;
  expiresAt: number; // Date.now()-based timestamp
}

const urlCache = new Map<string, CacheEntry>();
const pendingFetches = new Map<string, Promise<string | null>>();

async function fetchSignedUrl(videoPath: string): Promise<string | null> {
  // Return cached if still fresh
  const cached = urlCache.get(videoPath);
  if (cached && cached.expiresAt - REFRESH_BUFFER_MS > Date.now()) {
    return cached.url;
  }

  // De-duplicate concurrent requests for the same path
  const inflight = pendingFetches.get(videoPath);
  if (inflight) return inflight;

  const promise: Promise<string | null> = (async () => {
    try {
      const res = await fetch(
        `/api/video-signed-url?path=${encodeURIComponent(videoPath)}`
      );
      if (!res.ok) {
        console.warn(`[video] signed-url ${res.status} for ${videoPath}`);
        return null;
      }
      const { signedUrl } = (await res.json()) as { signedUrl: string };
      urlCache.set(videoPath, {
        url: signedUrl,
        expiresAt: Date.now() + SIGNED_URL_TTL_MS,
      });
      return signedUrl;
    } catch (err) {
      console.warn(`[video] signed-url fetch failed for ${videoPath}`, err);
      return null;
    } finally {
      pendingFetches.delete(videoPath);
    }
  })();

  pendingFetches.set(videoPath, promise);
  return promise;
}

// ── Hook: useSignedUrl ────────────────────────────────────────────────────────
function useSignedUrl(videoPath: string) {
  const [url, setUrl] = useState<string | null>(() => {
    const cached = urlCache.get(videoPath);
    return cached && cached.expiresAt - REFRESH_BUFFER_MS > Date.now()
      ? cached.url
      : null;
  });

  // Force-refresh (e.g. on video error)
  const refresh = useCallback(async () => {
    urlCache.delete(videoPath);
    pendingFetches.delete(videoPath);
    const fresh = await fetchSignedUrl(videoPath);
    if (fresh) setUrl(fresh);
  }, [videoPath]);

  useEffect(() => {
    let mounted = true;

    // Initial fetch
    fetchSignedUrl(videoPath).then((u) => {
      if (mounted && u) setUrl(u);
    });

    // Periodic refresh — check once per minute, refresh if near expiry
    const timer = setInterval(async () => {
      const cached = urlCache.get(videoPath);
      if (!cached || cached.expiresAt - REFRESH_BUFFER_MS < Date.now()) {
        urlCache.delete(videoPath);
        const fresh = await fetchSignedUrl(videoPath);
        if (mounted && fresh) setUrl(fresh);
      }
    }, 60_000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [videoPath]);

  return { url, refresh };
}

// ── VideoTile ─────────────────────────────────────────────────────────────────
function VideoTile({
  item,
  isInView,
}: {
  item: VideoItem;
  isInView: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { url: signedUrl, refresh } = useSignedUrl(item.videoPath);
  const errorCountRef = useRef(0);

  // Try to play when the video has enough data and the section is in view
  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, [isInView]);

  // Retry play when the section scrolls into view (onCanPlay may have
  // already fired while the section was off-screen)
  useEffect(() => {
    if (isInView) tryPlay();
  }, [isInView, tryPlay]);

  // On video error, refresh the signed URL (it may have expired)
  // Cap retries to prevent infinite loops for missing files
  const handleError = useCallback(() => {
    if (errorCountRef.current >= 3) return;
    errorCountRef.current += 1;
    console.warn(`[video] playback error, refreshing URL for ${item.videoPath}`);
    refresh();
  }, [refresh, item.videoPath]);

  const handleTap = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    }
  };

  return (
    <div
      className="group cursor-pointer flex-shrink-0 w-[220px] sm:w-[250px] md:w-[280px]"
      onClick={handleTap}
    >
      <div className="relative aspect-[9/16] rounded-[16px] overflow-hidden bg-[#111] shadow-[0_4px_24px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.14)] transition-shadow duration-500">
        {/* Always render the video element so the ref is stable;
            set src only when the signed URL is ready */}
        <video
          ref={videoRef}
          src={signedUrl ?? undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={signedUrl ? handleError : undefined}
          onCanPlay={tryPlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        {/* Skeleton overlay while signed URL is loading */}
        {!signedUrl && (
          <div className="absolute inset-0 animate-pulse bg-[#222]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 via-40% to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Play size={20} className="text-[#0a0a0a] ml-0.5" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} className="text-[#0a0a0a] ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function FeaturedVideosSection() {
  const { ref, isInView } = useInView({ threshold: 0.06 });
  const [isPaused, setIsPaused] = useState(false);

  const duplicatedItems = [...videoItems, ...videoItems];

  return (
    <section id="content" className="py-28 md:py-36 bg-[#fafafa]" ref={ref}>
      <style>{`
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
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
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
