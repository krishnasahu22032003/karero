import Hero from "@/components/Hero";
export default function Home() {
  return (
    <>
    <div className="grid-background"></div>
     <div className="relative z-10 text-white flex justify-center items-center min-h-screen">
        <Hero />
      </div>
      </>
  );
}
