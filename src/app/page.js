import SectionRail from "@/components/sections/SectionRail";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Intro from "@/components/sections/Intro";
// import Guarantees from "@/components/sections/Guarantees"; // kivéve: „Amit minden ügyfelem megkap”
import Statement from "@/components/sections/Statement";
import Services from "@/components/sections/Services";
// import FeaturedProject from "@/components/sections/FeaturedProject";
// import WhyMe from "@/components/sections/WhyMe"; // kivéve: „Mit kapsz, ha velem dolgozol?”
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import Faq from "@/components/sections/Faq";
import ContactForm from "@/components/sections/ContactForm";
import JsonLd from "@/components/ui/JsonLd";
import RevealObserver from "@/components/ui/RevealObserver";
import { faq } from "@/data/content";
import { faqSchema } from "@/lib/seo";

// Title/description/OG: a layout alapértéke. Canonical csak itt, hogy a 404 ne örökölje.
export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(faq)} />
      <SectionRail />
      <main>
        <Hero />
        <div className="relative z-10">
          <Problem />
          <Intro />
          {/* <Guarantees /> */}
          <Statement />
          <Services />
          {/* <FeaturedProject /> */}
          {/* <WhyMe /> */}
          <Projects />
          <Process />
          <Testimonials />
          <Pricing />
          <Faq />
          <ContactForm />
        </div>
      </main>
      <RevealObserver />
    </>
  );
}
