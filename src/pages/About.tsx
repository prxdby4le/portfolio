import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Twitter, MessageCircle } from "lucide-react";
import Navbar from "@/components/Layout/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Stickers, { ABOUT_STICKERS } from "@/components/Stickers/Stickers";

const About = () => {
  const [isBeats, setIsBeats] = useState(true);

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

  const visualizersPricing = [
    { 
      trabalho: "Base capa", 
      valor: "R$75", 
      observacao: "Capa deve já estar separada por camadas (ou arquivo PSD). Elementos do visualizer serão apenas os presentes na capa. (inclui aqui visualizers estilo TrapNation tamnbém)" 
    },
    { 
      trabalho: "Composição adicional", 
      valor: "R$130", 
      observacao: "Capa deve já estar separada por camadas (ou arquivo PSD). Inclui composição adicional além da capa, com um loop de até 45 segundos condando uma história ou passando uma idéia." 
    },
    { 
      trabalho: "Lyric video/edit", 
      valor: "R$170", 
      observacao: "Inclui aqui qualquer tipo de edit, seja com lyric ou sem, seja focado em lyric ou não, responsivo ao audio e legendas/lyrics personalizadas." 
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Psychedelic Background */}
      <div className="fixed inset-0 grain opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-psychedelic pointer-events-none" />
      <div className="fixed inset-0 stars-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 checkerboard pointer-events-none opacity-30" />
      
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-y2k-pink/10 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-y2k-cyan/10 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '1.5s' }} />
      
      {/* Notebook stickers */}
      <Stickers stickers={ABOUT_STICKERS} />

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
            <Card className="y2k-card overflow-visible">
              {/* Cover Photo */}
              <div className="relative h-48 sm:h-64 md:h-80 overflow-visible rounded-t-lg">
                <img 
                  src="/cover.jpg" 
                  alt="Foto de capa" 
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-y2k-pink/20 to-y2k-cyan/20 mix-blend-overlay rounded-t-lg" />
                
                {/* Profile Photo */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-[100]">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                    className="relative z-[100]"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-y2k-pink via-y2k-cyan to-y2k-yellow rounded-full animate-spin-slow opacity-80" />
                    <Avatar className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-4 border-y2k-pink shadow-lg overflow-hidden z-[100]" style={{ boxShadow: '0 0 30px #FF00FF, 0 0 60px #00FFFF40' }}>
                      <AvatarImage src="/profile.jpg" alt="Foto de perfil" className="object-contain" />
                      <AvatarFallback className="bg-gradient-to-br from-y2k-pink to-y2k-cyan text-black text-2xl sm:text-4xl font-display font-bold">
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
                      <span className="text-rainbow animate-text-shadow-pop">
                        prxdby4le
                      </span>
                    </h1>
                    <p className="text-y2k-cyan text-sm sm:text-base md:text-lg px-2 font-bold text-glow-cyan">
                      ★ Produtor Musical & Criador de Visualizers ★
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="max-w-2xl mx-auto px-2"
                  >
                    <p className="text-foreground/90 leading-relaxed text-sm sm:text-base md:text-lg">
                      Produtor Musical e criador de conteúdo criativo. <br className="hidden sm:block" />
                      Gostou de algo? Entre em contato em qualquer rede social. <span className="animate-blink">|</span>
                    </p>
                  </motion.div>

                  {/* Social Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2"
                  >
                    <Button asChild variant="glass" size="sm" className="y2k-btn flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm rounded-xl">
                      <Link to="https://www.instagram.com/prxdby4le/" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Instagram</span>
                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="glass" size="sm" className="y2k-btn flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm rounded-xl" style={{ animationDelay: '0.5s' }}>
                      <Link to="https://x.com/prxdby4le" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Twitter</span>
                        <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="glass" size="sm" className="y2k-btn flex-col h-auto py-3 px-4 sm:py-4 sm:px-6 text-xs sm:text-sm rounded-xl" style={{ animationDelay: '1s' }}>
                      <Link to="https://discord.gg/prJAME5pwx" target="_blank" rel="noopener noreferrer" className="no-underline flex flex-col items-center gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-sm">Discord</span>
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Decorative Y2K divider */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex items-center justify-center gap-2 sm:gap-3 pt-2 sm:pt-4"
                  >
                    <span className="text-y2k-pink animate-star-twinkle">✦</span>
                    <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-y2k-pink to-y2k-cyan rounded-full" />
                    <span className="text-y2k-yellow animate-star-twinkle" style={{ animationDelay: '0.3s' }}>★</span>
                    <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-y2k-cyan to-y2k-yellow rounded-full" />
                    <span className="text-y2k-cyan animate-star-twinkle" style={{ animationDelay: '0.6s' }}>✦</span>
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
              <Card className="y2k-card">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-display font-bold text-center text-rainbow">
                    ✧ Tabela de Preços ✧
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Switch Toggle */}
                  <div className="flex items-center justify-center gap-4">
                    <Label 
                      htmlFor="pricing-switch" 
                      className={`text-sm font-bold cursor-pointer transition-colors ${
                        isBeats ? 'text-y2k-pink text-glow-pink' : 'text-muted-foreground'
                      }`}
                    >
                      Beats
                    </Label>
                    <Switch
                      id="pricing-switch"
                      checked={!isBeats}
                      onCheckedChange={(checked) => setIsBeats(!checked)}
                    />
                    <Label 
                      htmlFor="pricing-switch" 
                      className={`text-sm font-bold cursor-pointer transition-colors ${
                        !isBeats ? 'text-y2k-cyan text-glow-cyan' : 'text-muted-foreground'
                      }`}
                    >
                      Visualizers
                    </Label>
                  </div>

                  {/* Pricing Table */}
                  <motion.div
                    key={isBeats ? 'beats' : 'visualizers'}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass rounded-lg overflow-hidden border border-y2k-pink/30">
                      <Accordion type="single" collapsible className="w-full">
                        <div className="divide-y divide-y2k-pink/20">
                          <div className="grid grid-cols-2 gap-4 px-4 py-3 border-b-2 border-y2k-pink/30 bg-y2k-pink/5">
                            <div className="text-left font-bold text-sm sm:text-base text-y2k-pink">
                              {isBeats ? 'Obra' : 'Trabalho'}
                            </div>
                            <div className="text-right font-bold text-sm sm:text-base text-y2k-cyan">
                              Valor
                            </div>
                          </div>
                          
                          {(isBeats ? beatsPricing : visualizersPricing).map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-none">
                              <div>
                                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-y2k-pink/5">
                                  <div className="grid grid-cols-2 gap-4 w-full items-center">
                                    <div className="text-left font-bold text-sm sm:text-base">
                                      {isBeats ? item.obra : item.trabalho}
                                    </div>
                                    <div className="text-right font-bold text-sm sm:text-base text-y2k-yellow">
                                      {item.valor}
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                  <div className="text-xs sm:text-sm text-y2k-cyan/80 whitespace-pre-line pt-2">
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
              <Card className="y2k-card text-center p-4 sm:p-6 hover:border-y2k-pink group">
                <div className="text-2xl sm:text-3xl font-display font-bold text-y2k-pink text-glow-pink mb-1 sm:mb-2 group-hover:animate-bounce-crazy">
                  ♫ Beats
                </div>
                <p className="text-y2k-cyan/70 text-xs sm:text-sm font-bold">
                  Produção musical
                </p>
              </Card>
              
              <Card className="y2k-card text-center p-4 sm:p-6 hover:border-y2k-cyan group">
                <div className="text-2xl sm:text-3xl font-display font-bold text-y2k-cyan text-glow-cyan mb-1 sm:mb-2 group-hover:animate-bounce-crazy">
                  ✧ Visualizers
                </div>
                <p className="text-y2k-pink/70 text-xs sm:text-sm font-bold">
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
