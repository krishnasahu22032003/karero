"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";

const Tilt = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;


    setTilt({
      rx: (py - 0.9) * -6,
      ry: (px - 0.9) * 8,
      s: 1.03,
    });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0, s: 1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative rounded-3xl cursor-pointer overflow-hidden backdrop-blur-xl"
    >
   
      <div
        className="
          absolute inset-0 rounded-3xl pointer-events-none 
          opacity-0 group-hover:opacity-20 transition duration-500
        "
        style={{
          background:
            "radial-linear(circle at 50% 25%, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />

     
      <div
        className="
          absolute inset-0 rounded-3xl pointer-events-none 
          opacity-0 group-hover:opacity-25 transition duration-500
        "
        style={{
          background:
            "linear-linear(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05), rgba(255,255,255,0.1))",
        }}
      />

    
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


export default function CTASection() {
  return (
    <section
      id="cta"
      className="
        relative w-full py-32 px-6 md:px-16 lg:px-24 
        mx-auto overflow-hidden
      "
    >
   
      <div
        className="
          absolute top-0 left-0 w-full h-24
          bg-linear-to-b from-black/20 to-transparent
          dark:from-white/10 dark:to-transparent
          pointer-events-none
        "
      />


      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [-40, -100],
              x: [0, (Math.random() - 0.5) * 70],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
            className="absolute w-[3px] h-[3px] bg-black/20 dark:bg-white/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>


      <Tilt>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="
            relative rounded-3xl p-12 md:p-20 
            bg-linear-to-br from-white to-gray-100
            dark:from-neutral-900 dark:to-neutral-800
            border border-gray-200/40 dark:border-white/10
            shadow-[0_10px_40px_rgba(0,0,0,0.15)]
            dark:shadow-[0_18px_70px_rgba(0,0,0,0.55)]
            overflow-hidden
          "
        >
          
          <motion.div
            className="
              absolute -top-28 -right-28 w-[380px] h-[380px]
              rounded-full opacity-20
              bg-linear-to-br from-white/50 to-gray-200/10
              dark:from-white/10 dark:to-white/5
              blur-[110px]
            "
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />

      
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
              text-4xl md:text-4xl font-extrabold tracking-tight 
              text-black dark:text-white text-center
            "
          >
            Ready to  <span className="text-neutral-500 dark:text-neutral-300">
            Say About Karero
          </span>
          </motion.h2>

       
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="
              max-w-2xl mx-auto mt-6 
              text-gray-600 dark:text-gray-300/90
              text-center text-lg md:text-base leading-relaxed
            "
          >
            Join thousands using Karero to unlock new opportunities, sharpen skills,
            and move confidently toward your dream future.
          </motion.p>

    
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-10 flex justify-center"
          >
            <Link href="#home" scroll={true}>
  <motion.button
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.96 }}
    className=" px-8 py-4 rounded-full font-semibold text-lg
                bg-black text-white 
                dark:bg-white dark:text-black
                shadow-[0_10px_35px_rgba(0,0,0,0.25)]
                dark:shadow-[0_15px_50px_rgba(255,255,255,0.12)]
                flex items-center gap-2 transition-all cursor-pointer
              "
  >
    Start Your Journey
    <ArrowRight className="w-5 h-5" />
  </motion.button>
</Link>

          </motion.div>
        </motion.div>
      </Tilt>
    </section>
  );
}
