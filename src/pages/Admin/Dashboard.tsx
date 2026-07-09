import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TracksManager from "./TracksManager";
import PostsManager from "./PostsManager";
import PlaylistsManager from "./PlaylistsManager";
import SiteSettingsManager from "./SiteSettingsManager";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative p-4 sm:p-8">
      <div className="fixed inset-0 bg-gradient-cloud pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-8 glass-heavy p-4 rounded-2xl">
          <div>
            <h1 className="text-2xl font-display font-bold text-gradient-sky">Painel de Administração</h1>
            <p className="text-sm text-muted-foreground font-medium">Gerencie suas músicas e posts.</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </header>

        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 mb-8 glass-heavy rounded-xl h-auto sm:h-12 p-1">
            <TabsTrigger value="tracks" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Músicas
            </TabsTrigger>
            <TabsTrigger value="playlists" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Playlists
            </TabsTrigger>
            <TabsTrigger value="layout" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Layout
            </TabsTrigger>
            <TabsTrigger value="posts" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks">
            <TracksManager />
          </TabsContent>

          <TabsContent value="playlists">
            <PlaylistsManager />
          </TabsContent>

          <TabsContent value="layout">
            <SiteSettingsManager />
          </TabsContent>

          <TabsContent value="posts">
            <PostsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
