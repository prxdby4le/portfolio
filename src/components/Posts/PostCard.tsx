import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Post } from "@/types/data";
import { PostCarousel } from "./PostCarousel";

/**
 * Accent discipline, matching the track side of the site.
 *
 * This card used to print the title, the date and the link all in ink, so
 * everything was emphasised and nothing read as emphasis. The title is now
 * foreground like a track title, the date is quiet metadata, and the ink is
 * spent on the one thing you are meant to click.
 */
export function PostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="plate group p-6 sm:p-8">
      <header>
        <Link to={`/post/${post.id}`}>
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-ink sm:text-3xl">
            {post.title}
          </h3>
        </Link>
        <p className="font-mono-data mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <time dateTime={post.created_at}>{date}</time>
        </p>
      </header>

      <div
        className="prose prose-invert mt-5 line-clamp-4 max-w-none text-sm leading-relaxed sm:text-base
                   prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                   prose-p:text-muted-foreground prose-li:text-muted-foreground
                   prose-strong:text-foreground
                   prose-a:text-ink prose-a:no-underline hover:prose-a:underline
                   prose-code:text-ink prose-hr:border-border
                   prose-blockquote:border-l-ink prose-blockquote:text-muted-foreground"
      >
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <Link
        to={`/post/${post.id}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-ink-lift"
      >
        Ver detalhes
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.75}
        />
      </Link>

      <PostCarousel images={post.images || []} />
    </article>
  );
}
