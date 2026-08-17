/** @format */

import { Link } from "react-router-dom";
import { paths } from "@/shared/config/routes";
import { ArrowRightIcon, BoltIcon } from "./icons";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { containerClass } from "./container";

const DOT_COUNT = 5;
const ACTIVE_DOT = 3;

export function Hero() {
  return (
    <section id="jarayon" className={`${containerClass} mt-6`}>
      <div className="rounded-3xl bg-linear-to-br from-brand-soft to-brand-softer px-6 sm:px-12 py-12 sm:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight">
            <span className="text-brand-hover">Tizim Dizayni</span> haqida Bahodir
            bilan o'rganing
          </h1>
          <p className="text-ink-muted text-base sm:text-lg max-w-md">
            Professional darajadagi ta'lim platformasi orqali o'z bilimingizni
            oshiring. Bizning ekspertlar jamoasi sizga eng zamonaviy bilimlarni
            ulashishadi.
          </p>
          <div>
            <Link
              to={paths.register}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-on-brand font-medium hover:bg-brand-hover transition-colors"
            >
              Ishtirok etish
              <ArrowRightIcon />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: DOT_COUNT }, (_, dot) => (
              <span
                key={dot}
                className={`h-1.5 rounded-full ${dot === ACTIVE_DOT ? "w-6 bg-brand" : "w-4 bg-ink-muted/30"}`}
              />
            ))}
          </div>
        </div>

        <div className="relative rotate-1">
          <ImagePlaceholder
            alt="Bahodir — Tizim dizayni kursi"
            className="w-full aspect-4/3 rounded-2xl shadow-xl"
          />
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-on-brand text-xs font-medium">
            <BoltIcon />
            Yangi kurs
          </span>
        </div>
      </div>
    </section>
  );
}
