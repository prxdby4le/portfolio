import { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause, ArrowLeft, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { supabase } from "@/lib/supabase";
import { Track } from "@/types/data";
import { usePlayer } from "@/hooks/usePlayer";
import { useTrackPeaks } from "@/hooks/useTrackPeaks";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import DuotonePlate from "@/components/Duotone/DuotonePlate";
import Tilt3D from "@/components/Duotone/Tilt3D";
import TrackWaveform from "@/components/Player/TrackWaveform";
import { formatDuration } from "@/lib/format";

const SOFT = [0.22, 1, 0.36, 1] as const;

export default function TrackDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { currentTrack, isPlaying, handlePlayTrack, audioRef, seek } = usePlayer();

  const { data: track, isLoading, error } = useQuery({
    queryKey: ["track", id],
    queryFn: async () => {
      if (!id) throw new Error("ID não fornecido");

      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const mappedTrack: Track = {
        id: data.id,
        title: data.title,
        genre: data.genre,
        bpm: data.bpm,
        key: data.track_key || undefined,
        cover: data.cover_url,
        src: data.audio_url,
        tags: data.tags || [],
        duration_seconds: data.duration_seconds ?? undefined,
        downloadable: data.downloadable ?? undefined,
        description: data.description || undefined,
        timeline_image: data.timeline_image_url || undefined,
      };

      return mappedTrack;
    },
    enabled: !!id,
  });

  const isCurrent = !!track && currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;

  const { peaks, duration: decodedDuration, status: peaksStatus } = useTrackPeaks(track?.src);

  // The waveform gives us the true length, which beats anything stored.
  const duration = decodedDuration || track?.duration_seconds || 0;

  // Clicking the waveform on a track that is not loaded yet should start it at
  // that point, not at zero. The position is parked here until the element has
  // metadata and can actually accept a seek.
  const pendingSeek = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isCurrent) return;

    const apply = () => {
      if (pendingSeek.current === null) return;
      seek(pendingSeek.current);
      pendingSeek.current = null;
    };

    if (audio.readyState >= 1) apply();
    audio.addEventListener("loadedmetadata", apply);
    return () => audio.removeEventListener("loadedmetadata", apply);
  }, [isCurrent, audioRef, seek]);

  const handleSeekRatio = (ratio: number) => {
    if (!track || duration <= 0) return;
    const seconds = ratio * duration;
    if (isCurrent) {
      seek(seconds);
    } else {
      pendingSeek.current = seconds;
      handlePlayTrack(track);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background pt-20">
        <Navbar />
        <div className="mx-auto w-full max-w-[1100px] px-6 py-12">
          <div className="grid gap-12 md:grid-cols-[minmax(0,22rem)_1fr]">
            <div className="aspect-square animate-soft-pulse rounded-lg bg-paper-raised" />
            <div className="space-y-4 pt-4">
              <div className="h-10 w-2/3 animate-soft-pulse rounded-sm bg-paper-raised" />
              <div className="h-4 w-1/3 animate-soft-pulse rounded-sm bg-paper-raised" />
              <div className="h-24 w-full animate-soft-pulse rounded-lg bg-paper-raised" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-background pt-20">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Essa faixa não existe
          </h1>
          <p className="mt-2 max-w-[38ch] text-sm text-muted-foreground">
            O link pode estar errado ou a faixa saiu do catálogo.
          </p>
          <Link to="/" className="ink-btn mt-8 inline-flex h-11 items-center px-5 text-sm">
            Ver o catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const enter = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: SOFT },
        };

  return (
    <div className="min-h-[100dvh] bg-background pt-20">
      <Navbar />

      <article className="mx-auto w-full max-w-[1100px] px-6 py-10 sm:py-14">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Voltar
        </button>

        <div className="grid gap-12 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
          {/* ------------------------------------------------------- plate */}
          <motion.div {...enter(0)} className="group">
            <Tilt3D max={8} lift={48}>
              <DuotonePlate
                src={track.cover}
                alt={`Capa de ${track.title}`}
                live={isCurrent}
                priority
                className="aspect-square shadow-[var(--shadow-lift)]"
              />
            </Tilt3D>
          </motion.div>

          {/* -------------------------------------------------------- meta */}
          <motion.div {...enter(0.1)} className="min-w-0">
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {track.title}
            </h1>

            {/* Spec row, not a badge shelf. */}
            <dl className="font-mono-data mt-7 flex flex-wrap gap-x-10 gap-y-5 border-t border-ink/20 pt-6 text-xs uppercase tracking-wider">
              <div>
                <dt className="text-muted-foreground">Gênero</dt>
                <dd className="mt-1 text-sm normal-case tracking-normal text-foreground">
                  {track.genre}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">BPM</dt>
                <dd className="mt-1 text-sm text-foreground">{track.bpm}</dd>
              </div>
              {track.key && (
                <div>
                  <dt className="text-muted-foreground">Tom</dt>
                  <dd className="mt-1 text-sm text-foreground">{track.key}</dd>
                </div>
              )}
              {duration > 0 && (
                <div>
                  <dt className="text-muted-foreground">Duração</dt>
                  <dd className="mt-1 text-sm text-foreground">{formatDuration(duration)}</dd>
                </div>
              )}
            </dl>

            {track.tags.length > 0 && (
              <p className="mt-6 text-sm lowercase text-muted-foreground">
                {track.tags.join("   ")}
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <motion.button
                type="button"
                onClick={() => handlePlayTrack(track)}
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { y: 0, scale: 0.985 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="ink-btn inline-flex h-12 items-center gap-2.5 px-6 text-sm"
              >
                {isThisPlaying ? (
                  <Pause className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <Play className="h-4 w-4" strokeWidth={1.75} />
                )}
                {isThisPlaying ? "Pausar" : "Ouvir"}
              </motion.button>

              {track.downloadable && (
                <a
                  href={track.src}
                  download
                  className="ink-ghost inline-flex h-12 items-center gap-2.5 px-6 text-sm font-medium"
                >
                  <Download className="h-4 w-4" strokeWidth={1.75} />
                  Baixar
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* ---------------------------------------------------- waveform */}
        <motion.section {...enter(0.2)} className="mt-14">
          {peaksStatus === "error" ? (
            <p className="font-mono-data text-xs uppercase tracking-wider text-muted-foreground">
              Não foi possível ler a forma de onda desta faixa.
            </p>
          ) : (
            <>
              <TrackWaveform
                peaks={peaks}
                duration={duration}
                isCurrent={isCurrent}
                loading={peaksStatus === "loading"}
                onSeekRatio={handleSeekRatio}
                className="h-24 sm:h-32"
              />
              <p className="font-mono-data mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                Clique na onda para navegar
              </p>
            </>
          )}
        </motion.section>

        {/* ------------------------------------------------- the session */}
        {track.timeline_image && (
          <motion.section {...enter(0.1)} className="group mt-20">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              A sessão
            </h2>
            <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
              O projeto aberto, do jeito que essa faixa foi montada.
            </p>

            <div className="mt-7">
              <DuotonePlate
                src={track.timeline_image}
                alt={`Projeto do beat ${track.title} aberto na DAW`}
                fit="contain"
                className="max-h-[70vh] w-full shadow-[var(--shadow-lift)]"
              />
            </div>
          </motion.section>
        )}

        {/* -------------------------------------------------- description */}
        {track.description && (
          <motion.section {...enter(0.1)} className="mt-20 max-w-[68ch]">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Sobre o beat
            </h2>
            <div
              className="prose prose-invert mt-6 max-w-none
                         prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                         prose-p:text-muted-foreground prose-p:leading-relaxed
                         prose-li:text-muted-foreground
                         prose-strong:text-foreground
                         prose-a:text-ink prose-a:no-underline hover:prose-a:underline
                         prose-code:text-ink prose-hr:border-border
                         prose-blockquote:border-l-ink prose-blockquote:text-muted-foreground"
            >
              <ReactMarkdown>{track.description}</ReactMarkdown>
            </div>
          </motion.section>
        )}

        {!track.description && !track.timeline_image && (
          <p className="mt-20 text-sm text-muted-foreground">
            Ainda não há detalhes escritos sobre essa faixa.
          </p>
        )}
      </article>

      <Footer />
    </div>
  );
}
