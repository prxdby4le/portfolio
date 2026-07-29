import { slugify } from "@/lib/utils";

export interface GenreIndexEntry {
  label: string;
  count: number;
}

interface GenreIndexProps {
  entries: GenreIndexEntry[];
}

/**
 * A jump list for the catalogue.
 *
 * The home page runs past seven thousand pixels of near-identical genre rails,
 * so anything below the third one is effectively unreachable. This gives the
 * page a table of contents and breaks the rhythm before the rails start.
 *
 * Counts are real. If a genre is empty it never reaches this list.
 */
export default function GenreIndex({ entries }: GenreIndexProps) {
  if (entries.length < 2) return null;

  return (
    <nav aria-label="Índice de gêneros" className="border-t border-ink/20 pt-5">
      <h2 className="font-mono-data text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        No catálogo
      </h2>

      <ul className="mt-4 flex flex-wrap gap-2">
        {entries.map((entry) => (
          <li key={entry.label}>
            <a
              href={`#genero-${slugify(entry.label)}`}
              className="group inline-flex items-baseline gap-2 rounded-md border border-border px-3.5 py-2 text-sm text-foreground transition-colors duration-300 hover:border-ink hover:bg-ink/8 hover:text-ink"
            >
              {entry.label}
              <span className="font-mono-data text-[11px] text-muted-foreground transition-colors group-hover:text-ink">
                {entry.count}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
