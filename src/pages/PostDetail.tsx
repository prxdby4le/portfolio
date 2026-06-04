import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AeroBubbles, { INDEX_BUBBLES } from "@/components/Aero/AeroBubbles";
import Navbar from "@/components/Layout/Navbar";
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
    <div className="min-h-screen bg-background relative overflow-hidden pb-32 pt-20">
      <Navbar activeTab="posts" />

      {/* Frutiger Aero Background */}
      <div className="fixed inset-0 bg-gradient-cloud pointer-events-none -z-10" />
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-aero-sky/10 rounded-full blur-[120px] animate-float pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-aero-green/10 rounded-full blur-[120px] animate-float pointer-events-none -z-10" style={{ animationDelay: '2s' }} />
      <AeroBubbles bubbles={INDEX_BUBBLES} />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-white/20 glass"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <article className="aero-card p-6 md:p-10 glass-heavy">
          <header className="mb-8 border-b border-white/20 pb-6">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-gradient-sky mb-4">{post.title}</h1>
            <p className="text-aero-sky/80 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-aero-sky"></span>
              {new Date(post.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </header>

          {post.images && post.images.length > 0 && (
            <div className="mb-10">
              <PostCarousel images={post.images} />
            </div>
          )}

          <div className="prose prose-invert md:prose-lg prose-p:text-foreground/90 prose-headings:text-gradient-sky max-w-none leading-relaxed">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
