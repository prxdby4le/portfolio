import { SiteSettings } from "@/types/data";

// Valores padrão usados como fallback enquanto a tabela `site_settings` não existir/carregar.
// Devem refletir o layout atual do site.
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero_title_line1: "Beats &",
  hero_title_line2: "Updates",
  hero_subtitle: "Produção musical e novidades",
  featured_enabled: false,
  featured_track_id: null,
  featured_message: "",
  show_spotify: true,
  show_favorites: true,
  show_recent: true,
  favorites_first: true,
};
