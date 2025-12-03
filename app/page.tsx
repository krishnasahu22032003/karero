import Hero from "@/components/Hero";
import UseCases from "@/components/UseCases";
import AboutKarero from "@/components/AboutKarero";
import Testimonials from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FaqSection";

export default function Home() {
  return (
    <>
    <div className="grid-background"></div>
     <div className="">
        <Hero />
        <UseCases />
        <AboutKarero />
        <Testimonials/>
        <CTASection/>
        <FAQSection/>
      </div>
      </>
  );
}
