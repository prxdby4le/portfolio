import { Post } from "@/types/data";
import { PostCard } from "./PostCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function PostsList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Post[];
    }
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-aero-sky" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {!posts || posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground aero-card rounded-xl">
          Nenhum post no momento.
        </div>
      ) : (
        posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))
      )}
    </div>
  );
}
