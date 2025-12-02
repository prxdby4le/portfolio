import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-10 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-7xl font-display font-bold mb-4 sm:mb-6"
          >
            <span className="bg-gradient-fruity bg-clip-text text-transparent text-glow-lime">
              Beats &
            </span>
            <br />
            <span className="bg-gradient-purple bg-clip-text text-transparent text-glow-purple">
              Visualizers
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-2"
          >
          Produção musical e visualizers.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}