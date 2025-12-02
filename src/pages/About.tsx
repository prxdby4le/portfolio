import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Twitter, MessageCircle } from "lucide-react";
import Navbar from "@/components/Layout/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const About = () => {

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 grain opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <Navbar activeTab="beats" onTabChange={() => {}} />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pt-20 sm:pt-24 pb-8 sm:pb-12"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Card */}
            <Card className="glass overflow-visible border-glass-border/10">
              {/* Cover Photo */}
              <div className="relative h-48 sm:h-64 md:h-80 overflow-visible">
                {/* Cover Image */}
                <img 
                  src="/cover.jpg" 
                  alt="Foto de capa" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Profile Photo Overlay */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-[100]">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                    className="relative z-[100]"
                  >
                    <div className="absolute inset-0 bg-gradient-fruity rounded-full p-0.5 sm:p-1 animate-pulse z-[100]" />
                    <Avatar className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-2 sm:border-4 border-background shadow-lg shadow-primary/50 overflow-hidden z-[100]">
                      <AvatarImage src="/profile.jpg" alt="Foto de perfil" className="object-contain" />
                      <AvatarFallback className="bg-gradient-fruity text-background text-2xl sm:text-4xl font-display font-bold">
                        P
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>
              </div>

              {/* Profile Content */}
              <CardContent className="pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 px-4 sm:px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center space-y-4 sm:space-y-6"
                >
                  {/* Name */}
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-1 sm:mb-2">
                      <span className="bg-gradient-fruity bg-clip-text text-transparent text-glow-lime">
                        prxdby4le
                      </span>
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-2">
                      Produtor Musical & Criador de Visualizers
                    </p>
                  </div>

                  {/* Bio */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="max-w-2xl mx-auto px-2"
                  >
                    <p className="text-foreground/90 leading-relaxed text-sm sm:text-base md:text-lg">
                      Produtor Musical e criador de conteúdo criativo. <br className="hidden sm:block" />
                      Gostou de algo? Entre em contato em qualquer rede social.
                    </p>
                  </motion.div>

                  {/* Social Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2"
                  >
                    <Button asChild variant="glass" size="sm" className="flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm">
                      <Link to="https://www.instagram.com/prxdby4le/" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Instagram</span>
                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="glass" size="sm" className="flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm">
                      <Link to="https://x.com/prxdby4le" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Twitter</span>
                        <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="glass" size="sm" className="flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm">
                      <Link to="https://discord.gg/prJAME5pwx" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Discord</span>
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Decorative Elements */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex items-center justify-center gap-2 sm:gap-4 pt-2 sm:pt-4"
                  >
                    <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-lime rounded-full" />
                    <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-orange rounded-full" />
                    <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-purple rounded-full" />
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Additional Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
            >
              <Card className="glass border-glass-border/10 text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-display font-bold bg-gradient-lime bg-clip-text text-transparent mb-1 sm:mb-2">
                  Beats
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Produção musical
                </p>
              </Card>
              
              <Card className="glass border-glass-border/10 text-center p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-display font-bold bg-gradient-purple bg-clip-text text-transparent mb-1 sm:mb-2">
                  Visualizers
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Arte visual
                </p>
              </Card>

            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default About;

