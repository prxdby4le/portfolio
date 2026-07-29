import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Twitter, MessageCircle } from "lucide-react";
import Navbar from "@/components/Layout/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const About = () => {

  const beatsPricing = [
    { 
      obra: "Full prod", 
      valor: "R$150", 
      observacao: "Inclui produção completa, composição, arranjo, mixagem, mixagem de vocais e masterização." 
    },
    { 
      obra: "Beat", 
      valor: "R$125", 
      observacao: "Beat feito sob medida conforme requisitos do cliente." 
    },
    { 
      obra: "Mix e Master", 
      valor: "R$125", 
      observacao: "Mixagem e masterização de faixas já gravadas." 
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-background">
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
            <Card className="aero-card overflow-visible">
              {/* Cover Photo */}
              <div className="relative h-48 sm:h-64 md:h-80 overflow-visible rounded-t-lg">
                <img 
                  src="/cover.jpg" 
                  alt="Foto de capa" 
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10 mix-blend-overlay rounded-t-lg" />
                
                {/* Profile Photo */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-[100]">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                    className="relative z-[100]"
                  >
                    <Avatar className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-2 border-ink overflow-hidden z-[100]">
                      <AvatarImage src="/profile.jpg" alt="Foto de perfil" className="object-contain" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl sm:text-4xl font-display font-bold">
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
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-1 sm:mb-2">
                      <span className="text-gradient-sky">
                        prxdby4le
                      </span>
                    </h1>
                    <p className="text-aero-sky text-sm sm:text-base md:text-lg px-2 font-medium">
                      Produtor Musical
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="max-w-2xl mx-auto px-2"
                  >
                    <p className="text-foreground/80 leading-relaxed text-sm sm:text-base md:text-lg">
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
                    <Button asChild variant="glass" size="sm" className="aero-btn flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm rounded-xl">
                      <Link to="https://www.instagram.com/prxdby4le/" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Instagram</span>
                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="glass" size="sm" className="aero-btn flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm rounded-xl">
                      <Link to="https://x.com/prxdby4le" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Twitter</span>
                        <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="glass" size="sm" className="aero-btn flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm rounded-xl">
                      <Link to="https://discord.gg/prJAME5pwx" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Discord</span>
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Subtle divider */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex items-center justify-center pt-2 sm:pt-4"
                  >
                    <div className="h-0.5 w-32 sm:w-48 bg-gradient-to-r from-transparent via-aero-sky/30 to-transparent rounded-full" />
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Pricing Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-6 sm:mt-8"
            >
              <Card className="aero-card">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-display font-bold text-center text-gradient-sky">
                    Tabela de Preços
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Pricing Table */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass rounded-lg overflow-hidden border border-white/30">
                      <Accordion type="single" collapsible className="w-full">
                        <div className="divide-y divide-border/50">
                          <div className="grid grid-cols-2 gap-4 px-4 py-3 border-b border-aero-sky/15 bg-aero-sky/5">
                            <div className="text-left font-semibold text-sm sm:text-base text-aero-sky">
                              Obra
                            </div>
                            <div className="text-right font-semibold text-sm sm:text-base text-aero-green">
                              Valor
                            </div>
                          </div>
                          
                          {beatsPricing.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-none">
                              <div>
                                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-aero-sky/5">
                                  <div className="grid grid-cols-2 gap-4 w-full items-center">
                                    <div className="text-left font-semibold text-sm sm:text-base">
                                      {item.obra}
                                    </div>
                                    <div className="text-right font-semibold text-sm sm:text-base text-aero-amber">
                                      {item.valor}
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                  <div className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line pt-2">
                                    {item.observacao}
                                  </div>
                                </AccordionContent>
                              </div>
                            </AccordionItem>
                          ))}
                        </div>
                      </Accordion>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
            >
              <Card className="aero-card text-center p-4 sm:p-6 group col-span-1 md:col-span-2">
                <div className="text-2xl sm:text-3xl font-display font-bold text-aero-sky mb-1 sm:mb-2 group-hover:scale-105 transition-transform">
                  ♫ Beats
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                  Produção musical
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
