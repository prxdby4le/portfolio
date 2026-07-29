import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PostCarousel } from "@/components/Posts/PostCarousel";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) throw new Error("ID não fornecido");

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Post;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center pt-20">
        <Navbar activeTab="posts" />
        <Loader2 className="w-12 h-12 text-aero-sky animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-4 pt-20">
        <Navbar activeTab="posts" />
        <h2 className="text-2xl font-bold mb-4 text-gradient-sky">Post não encontrado</h2>
        <Button onClick={() => navigate(-1)} variant="aero">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pt-20">
      <Navbar activeTab="posts" />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Voltar
        </button>

        <article>
          {/* Title in foreground, date as quiet metadata. Ink is reserved for
              things you act on, the same rule the rest of the site follows. */}
          <header className="mb-10 border-b border-border pb-7">
            <h1 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl">
              {post.title}
            </h1>
            <p className="font-mono-data mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </p>
          </header>

          {post.images && post.images.length > 0 && (
            <div className="mb-10">
              <PostCarousel images={post.images} />
            </div>
          )}

          <div
            className="prose prose-invert md:prose-lg max-w-none leading-relaxed
                       prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                       prose-p:text-muted-foreground prose-li:text-muted-foreground
                       prose-strong:text-foreground
                       prose-a:text-ink prose-a:no-underline hover:prose-a:underline
                       prose-code:text-ink prose-hr:border-border
                       prose-blockquote:border-l-ink prose-blockquote:text-muted-foreground"
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}
