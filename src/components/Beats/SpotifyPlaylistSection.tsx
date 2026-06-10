import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SpotifyPlaylistSection() {
  const playlistId = "4KvJJ8syMbCHDoGLTz1MAY";
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 sm:mb-12"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-display font-bold mb-1 sm:mb-2">
            <span className="text-gradient-sky">Trabalhos Publicados</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground pr-2 font-medium">
            Minha playlist do Spotify com todos os trabalhos publicados
          </p>
        </div>
        
        <Button 
          variant="aero" 
          onClick={() => window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank')}
          className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 flex-shrink-0"
        >
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Abrir no Spotify</span>
        </Button>
      </div>

      <div className="aero-card overflow-hidden" style={{ borderColor: 'rgba(255, 0, 102, 0.15)' }}>
        <iframe
          src={embedUrl}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="w-full"
          style={{ minHeight: '352px' }}
        />
      </div>
    </motion.section>
  );
}
