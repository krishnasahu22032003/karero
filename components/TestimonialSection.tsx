"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRef, useState } from "react";

/* ------------------------------------------------------------ */
/*                   FIXED TILT CARD (WORKING)                  */
/* ------------------------------------------------------------ */

type TiltProps = { children: React.ReactNode };

const TiltCard: React.FC<TiltProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({
      rx: (py - 0.9) * -10,
      ry: (px - 0.9) * 12,
      s: 1.05,
    });
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0, s: 1 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative rounded-3xl cursor-pointer overflow-hidden backdrop-blur-xl"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 18,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Glow Bloom */}
      <div
        className="
          absolute inset-0 rounded-3xl pointer-events-none 
          opacity-0 group-hover:opacity-20 transition duration-500
        "
        style={{
          background:
            "radial-gradient(circle at 50% 25%, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />

      {/* Border Shimmer */}
      <div
        className="
          absolute inset-0 rounded-3xl pointer-events-none 
          opacity-0 group-hover:opacity-25 transition duration-500
        "
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05), rgba(255,255,255,0.1))",
        }}
      />

      {/* INNER TILT WRAPPER — tilt lives here */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`,
          transition: "transform 120ms ease-out",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------ */
/*                     TESTIMONIAL DATA                         */
/* ------------------------------------------------------------ */

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Software Engineer",
    image: "/testimonials-1.jpg",
    text: "Karero helped me articulate my ideas with more clarity. The improvement feels unreal.",
  },
  {
    name: "Priya Kumar",
    role: "Product Designer",
    image: "/testimonials-2.jpg",
    text: "The AI coach feels like a real mentor guiding me through presentations and interviews.",
  },
  {
    name: "Rohan Mehta",
    role: "MBA Student",
    image: "/testimonials-3.jpg",
    text: "My interview delivery improved drastically. The tone analysis is next level.",
  },
  {
    name: "Sneha Kapoor",
    role: "Data Analyst",
    image: "/testimonials-4.jpg",
    text: "Karero tracks my growth beautifully. Each session builds more confidence.",
  },
  {
    name: "Harshit Jain",
    role: "Marketing Intern",
    image: "/testimonials-5.jpg",
    text: "I never imagined AI coaching could feel this human. Absolutely mind-blowing.",
  },
  {
    name: "Ananya Sen",
    role: "HR Specialist",
    image: "/testimonials-6.jpg",
    text: "Everything feels premium — UI, insights, coaching engine. Exceptional product.",
  },
];

/* ------------------------------------------------------------ */
/*                     MAIN COMPONENT                           */
/* ------------------------------------------------------------ */

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative w-full py-28 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto"
    >
            <div
        className="
          absolute top-0 left-0 w-full h-24
          bg-gradient-to-b from-black/20 to-transparent
          dark:from-white/10 dark:to-transparent
          pointer-events-none
        "
      />
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white">
          What People{" "}
          <span className="text-neutral-500 dark:text-neutral-300">
            Say About Karero
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-300/90 text-sm md:text-base mt-4 leading-relaxed">
          Powerful stories from people who leveled up their career with AI-driven coaching.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {testimonials.map((t, i) => (
          <TiltCard key={i}>
            <div
              className="
                p-9 rounded-3xl h-[360px]
                bg-gradient-to-br from-white to-gray-100
                dark:from-neutral-900 dark:to-neutral-800
                border border-gray-200/40 dark:border-white/10
                shadow-[0_10px_40px_rgba(0,0,0,0.15)]
                dark:shadow-[0_18px_70px_rgba(0,0,0,0.55)]
                flex flex-col justify-between
              "
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="
                    w-16 h-16 rounded-full object-cover
                    shadow-lg border border-white/60 dark:border-white/10
                    transition-transform duration-300 
                    group-hover:scale-110
                  "
                />
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 text-yellow-400 dark:text-yellow-300 mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <Star key={idx} size={18} fill="currentColor" />
                  ))}
              </div>

              {/* Review */}
              <p className="text-gray-700 dark:text-gray-300 text-center text-sm leading-relaxed mb-4">
                “{t.text}”
              </p>

              {/* Name */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black dark:text-white relative inline-block">
                  {t.name}
                  <span
                    className="
                      absolute left-0 -bottom-1 h-[2px] w-0
                      bg-gradient-to-r 
                      from-black/40 via-black/20 to-transparent
                      dark:from-white/40 dark:via-white/20 dark:to-transparent
                      transition-all duration-500
                      group-hover:w-full
                    "
                  ></span>
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {t.role}
                </p>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
