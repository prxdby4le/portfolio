import { motion } from "framer-motion";
import Stickers, { HERO_STICKERS } from "@/components/Stickers/Stickers";

export default function Hero() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden"
    >
      {/* Notebook stickers */}
      <Stickers stickers={HERO_STICKERS} />
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />
      
      {/* Psychedelic orbs */}
      <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-96 sm:h-96 bg-y2k-pink/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-10 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-y2k-cyan/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-y2k-yellow/20 rounded-full blur-3xl animate-spin-slow" />
      
      {/* Marquee strip */}
      <div className="relative z-10 overflow-hidden py-2 border-y-2 border-y2k-pink/50 mb-4 bg-y2k-pink/5">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-bold">
          <span className="text-y2k-pink mx-4">★ BEATS</span>
          <span className="text-y2k-cyan mx-4">★ VISUALIZERS</span>
          <span className="text-y2k-yellow mx-4">★ PRODUÇÃO MUSICAL</span>
          <span className="text-y2k-lime mx-4">★ CRIATIVIDADE</span>
          <span className="text-y2k-orange mx-4">★ PSICODÉLICO</span>
          <span className="text-y2k-purple mx-4">★ BEATS</span>
          <span className="text-y2k-pink mx-4">★ VISUALIZERS</span>
          <span className="text-y2k-cyan mx-4">★ PRODUÇÃO MUSICAL</span>
          <span className="text-y2k-yellow mx-4">★ CRIATIVIDADE</span>
          <span className="text-y2k-lime mx-4">★ PSICODÉLICO</span>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-display font-bold mb-4 sm:mb-6"
          >
            <span className="text-rainbow animate-text-shadow-pop block">
              Beats &
            </span>
            <span className="text-rainbow animate-text-shadow-pop block" style={{ animationDelay: '0.5s' }}>
              Visualizers
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-y2k-cyan max-w-xl mx-auto px-2 text-glow-cyan font-bold"
          >
            ~*~ Produção musical e visualizers ~*~
          </motion.p>

          {/* Decorative stars */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-3 mt-4"
          >
            {['✦', '✧', '★', '✧', '✦'].map((star, i) => (
              <span 
                key={i} 
                className="text-xl sm:text-2xl animate-star-twinkle animate-color-cycle"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {star}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
