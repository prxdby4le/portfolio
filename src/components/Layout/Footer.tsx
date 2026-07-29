import { Link } from "react-router-dom";
import { SOCIAL_LINKS, SPOTIFY_PLAYLIST_URL } from "@/lib/links";
import { usePlayer } from "@/hooks/usePlayer";
import { cn } from "@/lib/utils";

/**
 * The site had no footer on any route until now: no way back from a dead end,
 * no contact, nothing after the last genre rail.
 *
 * The wordmark is the closing plate of the print. It is set oversized and
 * clipped by the section, and it is `aria-hidden` because the name is already
 * announced by the navigation.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const { currentTrack } = usePlayer();

  return (
    <footer
      className={cn(
        // Sections already carry their own bottom margin; stacking a large
        // one here on top of it reads as a hole rather than as breathing room.
        "relative mt-12 overflow-hidden border-t border-border",
        // The player is fixed to the bottom of the viewport. Clearance has to
        // live here, on the last thing in the document, or the closing lines
        // sit underneath it. Every page reuses this footer, so putting it here
        // fixes all of them at once.
        currentTrack && "pb-24"
      )}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-14">
        <div className="flex flex-wrap justify-between gap-x-16 gap-y-10">
          <nav aria-label="Navegação do rodapé">
            <h2 className="font-mono-data text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Navegar
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm text-foreground transition-colors hover:text-ink"
                >
                  Beats
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre"
                  className="text-sm text-foreground transition-colors hover:text-ink"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <a
                  href={SPOTIFY_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground transition-colors hover:text-ink"
                >
                  Spotify
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-mono-data text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Contato
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sentence case rather than the mono caps used for the column
              labels: this is a real sentence now, and long all-caps lines are
              slower to read. */}
          <p className="max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
            Beats originais, criados e pensados pra pessoas.
            <br />
            Me contate se tiver interesse
          </p>
        </div>

        {/* Closing plate. Oversized, clipped, ink on paper. */}
        <div className="relative mt-16 select-none" aria-hidden="true">
          <p className="masthead whitespace-nowrap font-display text-[clamp(4rem,17vw,13rem)] font-bold leading-[0.8] text-ink-deep">
            prxdby4le
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-6">
          <p className="font-mono-data text-[11px] uppercase tracking-wider text-muted-foreground">
            {year} prxdby4le
          </p>
          <p className="font-mono-data text-[11px] uppercase tracking-wider text-muted-foreground">
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
