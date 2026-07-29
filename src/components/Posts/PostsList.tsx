import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/data";
import { PostCard } from "./PostCard";

const SOFT = [0.22, 1, 0.36, 1] as const;

/** Matches a PostCard's shape so the column does not jump when data lands. */
function PostSkeleton() {
  return (
    <div className="plate p-6 sm:p-8" aria-hidden="true">
      <div className="h-7 w-2/3 animate-soft-pulse rounded-sm bg-paper-sunk" />
      <div className="mt-3 h-3 w-32 animate-soft-pulse rounded-sm bg-paper-sunk" />
      <div className="mt-6 space-y-2.5">
        <div className="h-3.5 w-full animate-soft-pulse rounded-sm bg-paper-sunk" />
        <div className="h-3.5 w-11/12 animate-soft-pulse rounded-sm bg-paper-sunk" />
        <div className="h-3.5 w-4/5 animate-soft-pulse rounded-sm bg-paper-sunk" />
      </div>
    </div>
  );
}

export default function PostsList() {
  const reduce = useReducedMotion();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14">
      {/* Same header shape the genre sections use, so the two tabs read as one
          site rather than two. */}
      <header className="mx-auto mb-10 max-w-3xl border-t border-ink/20 pt-5">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Novidades
        </h2>
        <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
          O que anda acontecendo no estúdio.
        </p>
      </header>

      <div className="mx-auto w-full max-w-3xl space-y-8">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : error ? (
          <div className="plate border-destructive/40 px-6 py-12">
            <p className="text-sm font-medium text-foreground">
              Não foi possível carregar os posts.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Verifique a conexão e recarregue a página.
            </p>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="plate-flush border-dashed px-6 py-20 text-center">
            <p className="text-sm font-medium text-foreground">Nenhum post ainda.</p>
            <p className="mx-auto mt-1 max-w-[34ch] text-sm text-muted-foreground">
              As novidades do estúdio aparecem aqui assim que forem publicadas.
            </p>
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.7,
                delay: Math.min(index, 4) * 0.08,
                ease: SOFT,
              }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
