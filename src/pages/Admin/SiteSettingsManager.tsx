import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutGrid, Loader2, Sparkles, Type } from "lucide-react";
import { SiteSettings } from "@/types/data";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";

export default function SiteSettingsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: tracks } = useQuery({
    queryKey: ["admin-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tracks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setSettings({
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
      });
    }
  }, [data]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ id: "main", ...settings, updated_at: new Date().toISOString() });
      if (error) throw error;

      toast({ title: "Configurações do site salvas!" });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar configurações",
        description: getErrorMessage(error, "Rode a migração supabase_migration_site_settings.sql no Supabase."),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-aero-sky" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Faixa em destaque */}
        <div className="aero-card p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
            <Sparkles className="text-aero-sky w-5 h-5" />
            Faixa em Destaque
          </h2>
          <p className="text-xs text-muted-foreground mb-4 font-medium">
            Exibe uma faixa no topo do site com uma mensagem ao lado.
          </p>

          <div className="flex items-center justify-between glass rounded-xl border border-primary/10 p-3 mb-4">
            <span className="text-sm font-semibold">Mostrar destaque no site</span>
            <Switch
              checked={settings.featured_enabled}
              onCheckedChange={(v) => set("featured_enabled", v)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Faixa</label>
              <Select
                value={settings.featured_track_id ?? ""}
                onValueChange={(v) => set("featured_track_id", v)}
              >
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Selecione uma faixa..." />
                </SelectTrigger>
                <SelectContent>
                  {(tracks ?? []).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title} - {t.genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Mensagem ao lado</label>
              <textarea
                value={settings.featured_message}
                onChange={(e) => set("featured_message", e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-md glass border-primary/15 focus:border-primary text-sm placeholder:text-muted-foreground/60 resize-y"
                placeholder="Ex: Meu lançamento mais recente! Confira essa batida nova..."
              />
            </div>
          </div>
        </div>

        {/* Textos do topo (Hero) */}
        <div className="aero-card p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
            <Type className="text-aero-sky w-5 h-5" />
            Textos do Topo
          </h2>
          <p className="text-xs text-muted-foreground mb-4 font-medium">
            Título e subtítulo exibidos no topo da página inicial.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Título - linha 1</label>
              <Input
                value={settings.hero_title_line1}
                onChange={(e) => set("hero_title_line1", e.target.value)}
                className="glass"
                placeholder="Beats &"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Título - linha 2</label>
              <Input
                value={settings.hero_title_line2}
                onChange={(e) => set("hero_title_line2", e.target.value)}
                className="glass"
                placeholder="Updates"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Subtítulo</label>
              <Input
                value={settings.hero_subtitle}
                onChange={(e) => set("hero_subtitle", e.target.value)}
                className="glass"
                placeholder="Produção musical e novidades"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout / seções */}
      <div className="aero-card p-6">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
          <LayoutGrid className="text-aero-sky w-5 h-5" />
          Layout das Seções
        </h2>
        <p className="text-xs text-muted-foreground mb-4 font-medium">
          Escolha quais seções aparecem na página inicial e em que ordem.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between glass rounded-xl border border-primary/10 p-3">
            <span className="text-sm font-semibold">Trabalhos Publicados (Spotify)</span>
            <Switch checked={settings.show_spotify} onCheckedChange={(v) => set("show_spotify", v)} />
          </div>
          <div className="flex items-center justify-between glass rounded-xl border border-primary/10 p-3">
            <span className="text-sm font-semibold">Seção Favoritos</span>
            <Switch checked={settings.show_favorites} onCheckedChange={(v) => set("show_favorites", v)} />
          </div>
          <div className="flex items-center justify-between glass rounded-xl border border-primary/10 p-3">
            <span className="text-sm font-semibold">Seção Uploads Recentes</span>
            <Switch checked={settings.show_recent} onCheckedChange={(v) => set("show_recent", v)} />
          </div>
          <div className="flex items-center justify-between glass rounded-xl border border-primary/10 p-3">
            <span className="text-sm font-semibold">
              {settings.favorites_first ? "Favoritos antes de Recentes" : "Recentes antes de Favoritos"}
            </span>
            <Switch checked={settings.favorites_first} onCheckedChange={(v) => set("favorites_first", v)} />
          </div>
        </div>
      </div>

      <Button variant="aero" className="w-full" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Salvar Configurações do Site"}
      </Button>
    </div>
  );
}
