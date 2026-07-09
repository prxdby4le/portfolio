import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SiteSettings } from "@/types/data";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      // Fallback para os defaults se a tabela ainda não existir ou estiver vazia
      if (error || !data) {
        return DEFAULT_SITE_SETTINGS;
      }

      // Mescla com os defaults para tolerar colunas ausentes/nulas
      return {
        hero_title_line1: data.hero_title_line1 ?? DEFAULT_SITE_SETTINGS.hero_title_line1,
        hero_title_line2: data.hero_title_line2 ?? DEFAULT_SITE_SETTINGS.hero_title_line2,
        hero_subtitle: data.hero_subtitle ?? DEFAULT_SITE_SETTINGS.hero_subtitle,
        featured_enabled: data.featured_enabled ?? DEFAULT_SITE_SETTINGS.featured_enabled,
        featured_track_id: data.featured_track_id ?? null,
        featured_message: data.featured_message ?? DEFAULT_SITE_SETTINGS.featured_message,
        show_spotify: data.show_spotify ?? DEFAULT_SITE_SETTINGS.show_spotify,
        show_favorites: data.show_favorites ?? DEFAULT_SITE_SETTINGS.show_favorites,
        show_recent: data.show_recent ?? DEFAULT_SITE_SETTINGS.show_recent,
        favorites_first: data.favorites_first ?? DEFAULT_SITE_SETTINGS.favorites_first,
      };
    },
  });
}
