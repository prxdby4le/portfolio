import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative pt-24 pb-12 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
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
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Produção musical com estética fruitygear. Beats originais e visualizers hipnotizantes.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}