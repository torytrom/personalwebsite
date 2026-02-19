import { Navbar } from "./components/navbar";
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { FeaturedVideosSection } from "./components/featured-videos-section";
import { BrandsSection } from "./components/brands-section";
import { SpeakingSection } from "./components/speaking-section";
import { ConsultingSection } from "./components/consulting-section";
import { NewsletterSection } from "./components/newsletter-section";
import { Footer } from "./components/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white font-['Inter'] antialiased">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturedVideosSection />
        <BrandsSection />
        <SpeakingSection />
        <ConsultingSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
