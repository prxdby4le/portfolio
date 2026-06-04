import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function PostLightbox({ imageSrc, children }: { imageSrc: string, children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
        <img src={imageSrc} alt="Post image enlarged" className="w-full h-auto max-h-[85vh] object-contain rounded-md" />
      </DialogContent>
    </Dialog>
  );
}
