import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DEFAULT_GENRES } from "@/lib/genres";

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("genres")
        .select("name, sort_order")
        .order("sort_order", { ascending: true });

      // Fallback para a ordem padrão se a tabela ainda não existir ou estiver vazia
      if (error || !data || data.length === 0) {
        return DEFAULT_GENRES;
      }

      return data.map((g) => g.name);
    },
  });
}
