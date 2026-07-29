import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PostLightbox } from "./PostLightbox";
import DuotonePlate from "@/components/Duotone/DuotonePlate";

/**
 * Post images print in the same two inks as everything else.
 *
 * They used to render in full colour, which made them the only full-spectrum
 * thing on the site: a cyan photograph sitting inside a magenta duotone page.
 * They now develop back to their real colours when you point at the card, the
 * same rule the covers follow, and the lightbox always shows the original.
 */
export function PostCarousel({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  const arrow =
    "h-9 w-9 rounded-md border-border bg-paper-raised text-foreground transition-colors hover:border-ink hover:bg-paper-raised hover:text-ink disabled:opacity-30";

  return (
    // `group` lives here rather than only on the card, so the colour reveal
    // also works on the post detail page, where there is no card around it.
    <Carousel className="group mt-7 w-full">
      <CarouselContent>
        {images.map((img, idx) => (
          <CarouselItem key={idx}>
            <PostLightbox imageSrc={img}>
              <div className="cursor-pointer">
                <DuotonePlate
                  src={img}
                  alt={`Imagem ${idx + 1} do post`}
                  className="h-64 w-full sm:h-80 md:h-96"
                />
              </div>
            </PostLightbox>
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 && (
        <>
          <CarouselPrevious className={`left-3 ${arrow}`} />
          <CarouselNext className={`right-3 ${arrow}`} />
        </>
      )}
    </Carousel>
  );
}
