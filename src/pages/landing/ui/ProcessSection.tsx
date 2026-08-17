/** @format */

import { ImagePlaceholder } from "./ImagePlaceholder";
import { containerClass } from "./container";
import Step1 from "@/shared/assets/step1.png";
import Step2 from "@/shared/assets/step2.png";
import Step3 from "@/shared/assets/step3.png";

const steps = [
  { number: 1, title: "O'zingizga mos masterklassni tanlaysiz", img: Step1 },
  {
    number: 2,
    title: "Berilgan darslarni o'rganib, vazifalarni bajarasiz.",
    img: Step2,
  },
  {
    number: 3,
    title: "Amaliy mashg'ulotlarda qatnashing, sertifikatga ega bo'ling.",
    img: Step3,
  },
];

export function ProcessSection() {
  return (
    <section className={`${containerClass} mt-6`}>
      <div className="rounded-3xl bg-linear-to-br from-brand-soft to-brand-softer px-6 sm:px-12 py-12 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            O'rganish jarayoni qanday kechadi?
          </h2>
          <p className="text-ink-muted mt-2">
            Siz uchun eng qulay va samarali ta'lim tizimi
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-surface rounded-2xl p-5 flex flex-col gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-brand text-on-brand text-sm font-medium flex items-center justify-center">
                  {step.number}
                </span>
                <p className="font-semibold text-ink">{step.title}</p>
              </div>
              <ImagePlaceholder
                alt={step.title}
                className="w-full rounded-xl mt-auto object-cover"
                src={step.img}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
