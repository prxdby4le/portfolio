import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SpotifyPlaylistSection() {
  const playlistId = "4KvJJ8syMbCHDoGLTz1MAY";
  const spotifyUrl = `https://open.spotify.com/playlist/${playlistId}?si=c21OFLzgTFuK8xrXcTeT0g`;
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8 sm:mb-12"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-display font-bold mb-1 sm:mb-2 text-y2k-yellow" style={{ textShadow: '0 0 15px #FFFF0080' }}>
            🎵 Trabalhos Publicados
          </h2>
          <p className="text-xs sm:text-sm text-y2k-cyan/60 pr-2 font-bold">
            Minha playlist do Spotify com todos os trabalhos publicados
          </p>
        </div>
        
        <Button
          variant="glass"
          size="sm"
          onClick={() => window.open(spotifyUrl, '_blank', 'noopener,noreferrer')}
          className="y2k-btn flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 flex-shrink-0 rounded-lg"
          style={{ background: 'linear-gradient(135deg, #1DB954, #1ed760)', borderColor: '#1DB954' }}
        >
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Abrir no Spotify</span>
        </Button>
      </div>

      <div className="y2k-card overflow-hidden" style={{ borderColor: '#1DB95440' }}>
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
