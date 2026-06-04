import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PostLightbox } from "./PostLightbox";

export function PostCarousel({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  return (
    <Carousel className="w-full mt-6">
      <CarouselContent>
        {images.map((img, idx) => (
          <CarouselItem key={idx}>
            <PostLightbox imageSrc={img}>
              <div className="overflow-hidden rounded-lg cursor-pointer border border-white/10 glass shadow-md">
                <img src={img} alt={`Slide ${idx}`} className="w-full h-64 sm:h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </PostLightbox>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2 bg-background/50 hover:bg-background/80" />
          <CarouselNext className="right-2 bg-background/50 hover:bg-background/80" />
        </>
      )}
    </Carousel>
  );
}
