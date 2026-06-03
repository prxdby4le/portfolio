import { motion } from "framer-motion";
import AeroBubbles, { HERO_BUBBLES } from "@/components/Aero/AeroBubbles";
import heroBg from "@/assets/hero-bg.png";

export default function Hero() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img src={heroBg} alt="Background" className="w-full h-full object-cover mix-blend-overlay" />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
      </div>

      {/* Aero decorative bubbles */}
      <AeroBubbles bubbles={HERO_BUBBLES} />

      {/* Soft atmospheric orbs */}
      <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-96 sm:h-96 bg-aero-sky/8 rounded-full blur-3xl animate-soft-pulse z-0" />
      <div className="absolute bottom-0 right-10 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-aero-green/6 rounded-full blur-3xl animate-soft-pulse z-0" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-aero-violet/4 rounded-full blur-3xl animate-float z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-display font-bold mb-4 sm:mb-6"
          >
            <span className="text-gradient-sky block">
              Beats &
            </span>
            <span className="text-gradient-sky block">
              Visualizers
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-aero-sky max-w-xl mx-auto px-2 font-medium"
          >
            Produção musical e visualizers criativos
          </motion.p>

          {/* Subtle decorative line */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center mt-6"
          >
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-aero-sky/40 to-transparent rounded-full" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
