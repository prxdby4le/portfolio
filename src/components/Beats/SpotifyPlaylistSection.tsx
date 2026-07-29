import { ExternalLink } from "lucide-react";
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
      {/* Same header shape as GenreSection: ink rule, name, one line of body. */}
      <div className="mb-6 flex items-end justify-between gap-6 border-t border-ink/30 pt-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Trabalhos Publicados
          </h2>
          <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
            Minha playlist do Spotify com todos os trabalhos publicados
          </p>
        </div>

        <a
          href={`https://open.spotify.com/playlist/${playlistId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ink-ghost inline-flex h-9 shrink-0 items-center gap-2 px-3 text-xs font-medium"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Abrir no Spotify</span>
        </a>
      </div>

      <div className="overflow-hidden border border-border">
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
