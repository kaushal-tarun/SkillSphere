import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StudentShowcase from "@/components/StudentShowcase";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import StarterSplash from "@/components/StarterSplash";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf6f0] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <StarterSplash />
      <Navbar />
      <Hero />
      <StudentShowcase />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}