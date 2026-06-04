import ReactMarkdown from "react-markdown";
import { Post } from "@/types/data";
import { PostCarousel } from "./PostCarousel";
import { Link } from "react-router-dom";

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="aero-card p-6 sm:p-8 rounded-xl border border-white/20 glass overflow-hidden">
      <div className="mb-4">
        <Link to={`/post/${post.id}`}>
          <h3 className="text-2xl font-display font-bold text-gradient-sky mb-1 hover:brightness-110 transition-all">{post.title}</h3>
        </Link>
        <p className="text-sm text-aero-sky/70 font-medium">
          {new Date(post.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
      <div className="prose prose-invert prose-p:text-foreground/90 prose-headings:text-gradient-sky max-w-none text-sm sm:text-base leading-relaxed line-clamp-4">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      
      <div className="mt-4 mb-4">
        <Link to={`/post/${post.id}`} className="inline-flex items-center text-aero-sky hover:text-aero-sky/80 font-medium text-sm transition-colors">
          Ver detalhes <span aria-hidden="true" className="ml-1">&rarr;</span>
        </Link>
      </div>

      <PostCarousel images={post.images || []} />
    </div>
  );
}
