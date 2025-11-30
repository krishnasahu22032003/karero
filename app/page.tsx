import Hero from "@/components/Hero";
import UseCases from "@/components/UseCases";
import AboutKarero from "@/components/AboutKarero";
import Testimonials from "@/components/TestimonialSection";
export default function Home() {
  return (
    <>
    <div className="grid-background"></div>
     <div className="">
        <Hero />
        <UseCases />
        <AboutKarero />
        <Testimonials/>
      </div>
      </>
  );
}
