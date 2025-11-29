import Hero from "@/components/Hero";
import UseCases from "@/components/UseCases";
import AboutKarero from "@/components/AboutKarero";
export default function Home() {
  return (
    <>
    <div className="grid-background"></div>
     <div className="">
        <Hero />
        <UseCases />
        <AboutKarero />
      </div>
      </>
  );
}
