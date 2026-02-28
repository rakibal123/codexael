import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import TechStack from "@/components/home/TechStack";
import WhyChooseMe from "@/components/home/WhyChooseMe";
import CTA from "@/components/home/CTA";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <TechStack />
      <WhyChooseMe />
      <CTA />
      <Footer />
    </>
  );
}
