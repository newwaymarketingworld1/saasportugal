"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { testimonials } from "@/lib/content";
import { cn } from "@/lib/utils";

export type TestimonialImage = { src: string };

const arrowClass =
  "inline-flex size-12 items-center justify-center rounded-full border border-line text-ink transition-colors duration-150 hover:bg-paper disabled:opacity-40 disabled:hover:bg-transparent";

export function TestimonialsCarousel({
  images,
  titleId,
}: {
  images: TestimonialImage[];
  titleId: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = images.length;

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    let nearest = 0;
    let best = Infinity;
    items.forEach((item, i) => {
      const d = Math.abs(item.offsetLeft - track.offsetLeft - left);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setCurrent(nearest);
    setAtStart(left <= 2);
    setAtEnd(left + track.clientWidth >= track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateState();
    track.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      track.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  const scrollByItem = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0] as HTMLElement | undefined;
    const step = first ? first.getBoundingClientRect().width + 24 : track.clientWidth;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const showPrev = () => setOpenIndex((i) => (i === null ? i : (i - 1 + total) % total));
  const showNext = () => setOpenIndex((i) => (i === null ? i : (i + 1) % total));

  const controls = (
    <div className="flex gap-3">
      <button type="button" aria-label={testimonials.prevLabel} onClick={() => scrollByItem(-1)} disabled={atStart} className={arrowClass}>
        <ChevronLeft size={22} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button type="button" aria-label={testimonials.nextLabel} onClick={() => scrollByItem(1)} disabled={atEnd} className={arrowClass}>
        <ChevronRight size={22} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-end justify-between gap-8">
        <h2 id={titleId} className="t-h2 text-ink">
          {testimonials.title}
        </h2>
        <div className="hidden shrink-0 md:block">{controls}</div>
      </div>

      <ul
        ref={trackRef}
        aria-label={testimonials.title}
        className={cn(
          "-mx-5 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-2 md:-mx-10 md:scroll-px-10 md:px-10",
          "scroll-px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {images.map((img, i) => (
          <li key={img.src} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-48px)/3.25)]">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`${testimonials.openLabel}: ${testimonials.alt(i + 1, total)}`}
              className="relative block h-[380px] w-full overflow-hidden rounded-[12px] border border-line bg-white md:h-[420px]"
            >
              <Image
                src={img.src}
                alt={testimonials.alt(i + 1, total)}
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 46vw, 78vw"
                className="object-contain p-2"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-6">
        {/* Indicadores (o controle é o swipe e as setas) */}
        <div aria-hidden="true" className="flex gap-2.5">
          {images.map((img, i) => (
            <span
              key={img.src}
              className={cn(
                "size-2.5 rounded-full border border-sea transition-colors duration-150",
                i === current ? "bg-sea" : "bg-transparent",
              )}
            />
          ))}
        </div>
        <div className="md:hidden">{controls}</div>
      </div>

      <Dialog.Root open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-ink/80 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Dialog.Popup
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") showPrev();
              if (e.key === "ArrowRight") showNext();
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 md:p-10"
          >
            <Dialog.Title className="sr-only">
              {openIndex !== null ? testimonials.alt(openIndex + 1, total) : testimonials.title}
            </Dialog.Title>
            {/* Toque fora da imagem fecha */}
            <Dialog.Close aria-hidden="true" tabIndex={-1} className="absolute inset-0 cursor-default" />
            {openIndex !== null && (
              <div className="pointer-events-none relative h-full max-h-[86dvh] w-full max-w-[640px]">
                <Image
                  src={images[openIndex].src}
                  alt={testimonials.alt(openIndex + 1, total)}
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                  className="rounded-[12px] object-contain"
                />
              </div>
            )}
            <div className="relative mt-4 flex items-center gap-3">
              <button type="button" aria-label={testimonials.prevLabel} onClick={showPrev} className="inline-flex size-12 items-center justify-center rounded-full bg-paper text-ink">
                <ChevronLeft size={22} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <span className="min-w-16 text-center text-[0.9375rem] text-paper">
                {openIndex !== null ? `${openIndex + 1} de ${total}` : ""}
              </span>
              <button type="button" aria-label={testimonials.nextLabel} onClick={showNext} className="inline-flex size-12 items-center justify-center rounded-full bg-paper text-ink">
                <ChevronRight size={22} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <Dialog.Close
              aria-label={testimonials.closeLabel}
              className="absolute top-[calc(16px+env(safe-area-inset-top))] right-4 inline-flex size-12 items-center justify-center rounded-full bg-paper text-ink"
            >
              <X size={22} strokeWidth={1.5} aria-hidden="true" />
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
