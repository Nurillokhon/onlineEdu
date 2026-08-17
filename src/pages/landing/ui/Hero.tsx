/** @format */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/routes";
import { ArrowRightIcon, BoltIcon } from "./icons";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { containerClass } from "./container";

interface Slide {
  /** Leading phrase of the headline, shown in the brand colour. */
  accent: string;
  title: string;
  description: string;
  badge: string;
  /** Drop a course image here; falls back to a placeholder while empty. */
  image?: string;
}

const slides: Slide[] = [
  {
    accent: "Tizim Dizayni",
    title: "haqida Bahodir bilan o'rganing",
    description:
      "Professional darajadagi ta'lim platformasi orqali o'z bilimingizni oshiring. Bizning ekspertlar jamoasi sizga eng zamonaviy bilimlarni ulashishadi.",
    badge: "Yangi kurs",
  },
  {
    accent: "Frontend",
    title: "yo'nalishini noldan boshlab o'rganing",
    description:
      "React, TypeScript va zamonaviy interfeys arxitekturasi. Har bir mavzudan keyin amaliy loyiha topshirasiz va mentordan izoh olasiz.",
    badge: "Eng ommabop",
  },
  {
    accent: "Data Science",
    title: "asoslarini amaliy loyihalarda mustahkamlang",
    description:
      "Python, ma'lumotlarni tahlil qilish va mashinali o'qitish. Real ma'lumotlar to'plamlari bilan ishlab, portfolio yig'asiz.",
    badge: "Guruh to'lmoqda",
  },
  {
    accent: "UX/UI Dizayn",
    title: "orqali mahsulot dizayneri bo'ling",
    description:
      "Foydalanuvchi tadqiqotidan tayyor interfeysgacha. Figma'da ishlash, dizayn tizimi tuzish va portfolio himoyasi bir kursda.",
    badge: "Amaliyot bilan",
  },
];

const AUTOPLAY_MS = 7000;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  return (
    <section id="jarayon" className={`${containerClass} mt-6`}>
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className="rounded-3xl bg-linear-to-br from-brand-soft to-brand-softer px-6 sm:px-12 py-12 sm:py-16"
      >
        <div className="overflow-hidden -my-6 py-6">
          <div
            aria-live="polite"
            className={`flex ${reducedMotion ? "" : "transition-transform duration-500 ease-out"}`}
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slides.map((slide, index) => {
              // Only the visible slide carries the page's h1.
              const Heading = index === active ? "h1" : "h2";
              return (
                <div
                  key={slide.accent}
                  aria-hidden={index !== active}
                  // min-w-0 stops a long word (flex min-width: auto) from
                  // stretching the slide past the track width.
                  className="w-full min-w-0 shrink-0 grid md:grid-cols-2 gap-10 items-center"
                >
                  <div className="flex flex-col gap-6">
                    <Heading className="font-display text-3xl sm:text-5xl font-bold text-ink leading-tight wrap-break-word">
                      <span className="text-brand-hover">{slide.accent}</span>{" "}
                      {slide.title}
                    </Heading>
                    <p className="text-ink-muted text-base sm:text-lg max-w-md">
                      {slide.description}
                    </p>
                    <div>
                      <Link
                        to={paths.register}
                        tabIndex={index === active ? undefined : -1}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-on-brand font-medium hover:bg-brand-hover transition-colors"
                      >
                        Ishtirok etish
                        <ArrowRightIcon />
                      </Link>
                    </div>
                  </div>

                  <div className="relative rotate-1">
                    <ImagePlaceholder
                      src={slide.image}
                      alt={`${slide.accent} kursi`}
                      className="w-full aspect-4/3 rounded-2xl shadow-xl"
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-on-brand text-xs font-medium">
                      <BoltIcon />
                      {slide.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8">
          {slides.map((slide, index) => (
            <button
              key={slide.accent}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${slide.accent} kursiga o'tish`}
              aria-current={index === active}
              className="py-2 group"
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${
                  index === active
                    ? "w-6 bg-brand"
                    : "w-4 bg-ink-muted/30 group-hover:bg-ink-muted/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
