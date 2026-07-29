import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * The lightbox deliberately shows the untouched image. The duotone is how the
 * site presents pictures in a page; when you open one to look at it properly,
 * you should get the photograph.
 */
export function PostLightbox({
  imageSrc,
  children,
}: {
  imageSrc: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl overflow-hidden border-border bg-paper p-2">
        <DialogTitle className="sr-only">Imagem do post ampliada</DialogTitle>
        <img
          src={imageSrc}
          alt=""
          className="h-auto max-h-[85vh] w-full rounded-md object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
