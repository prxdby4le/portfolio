import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Image as ImageIcon, Loader2, Trash2, Pencil, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/types/data";

export default function PostsManager() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allPosts, refetch: refetchPosts, isLoading: loadingPosts } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    }
  });

  const handleDelete = async (id: string, imageUrls?: string[]) => {
    if (!window.confirm("Tem certeza que deseja excluir este post permanentemente?")) return;

    try {
      const getFileName = (url: string) => url.split('/').pop();

      const { error: dbError } = await supabase.from("posts").delete().eq("id", id);
      if (dbError) throw dbError;

      // Delete from storage
      if (imageUrls && imageUrls.length > 0) {
        const fileNames = imageUrls.map(getFileName).filter(Boolean) as string[];
        if (fileNames.length > 0) {
          await supabase.storage.from("post_images").remove(fileNames);
        }
      }

      toast({ title: "Post excluído com sucesso!" });
      refetchPosts();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao excluir post",
        description: error.message || "Ocorreu um erro.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha o título e o conteúdo.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrls: string[] = [];
      const existingPost = editingId ? allPosts?.find(p => p.id === editingId) : null;
      
      // If editing and no new images are provided, keep the existing images
      // If new images are provided, we overwrite the existing ones
      if (editingId && imageFiles.length === 0 && existingPost?.images) {
        uploadedImageUrls = existingPost.images;
      } else if (imageFiles.length > 0) {
        // Upload new images
        for (const file of imageFiles) {
          const ext = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
          
          const { error: uploadError } = await supabase.storage
            .from("post_images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const url = supabase.storage.from("post_images").getPublicUrl(fileName).data.publicUrl;
          uploadedImageUrls.push(url);
        }

        // Delete old images if editing
        if (editingId && existingPost?.images) {
          const getFileName = (url: string) => url.split('/').pop();
          const oldFileNames = existingPost.images.map(getFileName).filter(Boolean) as string[];
          if (oldFileNames.length > 0) {
             await supabase.storage.from("post_images").remove(oldFileNames);
          }
        }
      }

      const postData = {
        title,
        content,
        images: uploadedImageUrls,
      };

      if (editingId) {
        const { error: dbError } = await supabase.from("posts").update(postData).eq("id", editingId);
        if (dbError) throw dbError;
        toast({
          title: "Sucesso!",
          description: "Post atualizado com sucesso.",
        });
      } else {
        const { error: dbError } = await supabase.from("posts").insert([postData]);
        if (dbError) throw dbError;
        toast({
          title: "Sucesso!",
          description: "Post criado com sucesso.",
        });
      }

      // Reset form
      cancelEdit();
      refetchPosts();
      queryClient.invalidateQueries({ queryKey: ["posts"] });

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao salvar post",
        description: error.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Upload Form */}
      <div className="aero-card p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
          {editingId ? (
            <>
              <Pencil className="text-aero-sky w-5 h-5" />
              Editar Post
            </>
          ) : (
            <>
              <Upload className="text-aero-sky w-5 h-5" />
              Novo Post
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Título</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ex: Novo Beat Pack Disponível" className="glass" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Conteúdo (Markdown suportado)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="w-full min-h-[200px] p-3 rounded-md glass border-white/40 focus:border-aero-sky text-sm placeholder:text-muted-foreground/60 resize-y"
              placeholder="# Grande Atualização!&#10;&#10;Aqui estão as novidades..."
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-sm font-semibold">Imagens (Carrossel)</label>

            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex items-center gap-3 p-3 glass border-dashed rounded-lg">
                <ImageIcon className="text-aero-green" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {imageFiles.length > 0 
                      ? `${imageFiles.length} arquivo(s) selecionado(s)` 
                      : (editingId ? "Selecione para sobrescrever as imagens atuais" : "Selecionar imagens (.jpg, .png)")}
                  </p>
                </div>
              </div>
            </div>
            {imageFiles.length > 0 && (
              <ul className="text-xs text-muted-foreground list-disc list-inside px-2">
                {imageFiles.map((file, i) => <li key={i} className="truncate">{file.name}</li>)}
              </ul>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="aero" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingId ? "Salvar Alterações" : "Publicar Post")}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="flex-1 bg-white/5 border-white/10 hover:bg-white/10" onClick={cancelEdit} disabled={loading}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        <div className="aero-card p-6 h-full max-h-[800px] overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <FileText className="text-aero-sky w-5 h-5" />
            Posts Publicados
          </h2>

          {loadingPosts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-aero-sky" />
            </div>
          ) : allPosts?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 font-medium">Nenhum post encontrado.</p>
          ) : (
            <div className="space-y-4">
              {allPosts?.map((post) => (
                <div key={post.id} className="flex items-start gap-4 p-3 glass rounded-xl border border-white/20">
                  {post.images && post.images.length > 0 ? (
                     <img src={post.images[0]} alt="Post thumbnail" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.content}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-aero-sky hover:bg-aero-sky/10"
                      onClick={() => handleEdit(post)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(post.id, post.images)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
