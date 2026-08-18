import { useState } from "react";
import { courses } from "@/entities/course";
import type { Course } from "@/entities/course";
import { ArrowLeftIcon, ClockIcon, PlayIcon } from "@/shared/ui";

function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="h-1.5 rounded-full bg-line overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span
        className="block h-full rounded-full bg-brand"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function CourseDetail({ course }: { course: Course }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-bold text-ink">
          {course.title}
        </h2>
        <p className="text-ink-muted text-sm">{course.mentor}</p>
      </div>

      <p className="text-ink-muted">{course.summary}</p>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">Kurs o'zlashtirildi</span>
          <span className="font-medium text-ink">{course.progress}%</span>
        </div>
        <ProgressBar value={course.progress} />
      </div>

      <div className="flex flex-wrap gap-2">
        {course.topics.map((topic) => (
          <span
            key={topic}
            className="px-3 py-1.5 rounded-full bg-brand-soft text-brand text-sm"
          >
            {topic}
          </span>
        ))}
      </div>

      <dl className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-brand-softer px-4 py-3">
          <dt className="text-ink-muted text-sm">Darslar</dt>
          <dd className="text-ink text-xl font-semibold">{course.lessons}</dd>
        </div>
        <div className="rounded-xl bg-brand-softer px-4 py-3">
          <dt className="text-ink-muted text-sm">Soatlar</dt>
          <dd className="text-ink text-xl font-semibold">{course.hours}</dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Material 3 list-detail canonical layout: the two panes sit side by side once
 * the window is expanded, and stack into one navigable pane below that.
 */
export function CoursesPage() {
  const [selectedId, setSelectedId] = useState(courses[0].id);
  const selected =
    courses.find((course) => course.id === selectedId) ?? courses[0];
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-ink">Kurslarim</h1>

      <div className="expanded:grid expanded:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-6">
        <section
          aria-label="Kurslar ro'yxati"
          className={`flex-col gap-3 ${detailOpen ? "hidden expanded:flex" : "flex"}`}
        >
          {courses.map((course) => {
            const isSelected = course.id === selected.id;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setSelectedId(course.id);
                  setDetailOpen(true);
                }}
                aria-current={isSelected}
                className={`text-left rounded-2xl border p-4 flex flex-col gap-3 transition-colors ${
                  isSelected
                    ? "border-brand bg-card expanded:bg-brand-soft"
                    : "border-line bg-card hover:border-brand-hover"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{course.title}</p>
                    <p className="text-ink-muted text-sm">{course.mentor}</p>
                  </div>
                  <span className="text-ink-muted text-sm flex items-center gap-1 shrink-0">
                    <ClockIcon size={14} />
                    {course.hours} soat
                  </span>
                </div>
                <ProgressBar value={course.progress} />
              </button>
            );
          })}
        </section>

        <section
          aria-label="Kurs tafsilotlari"
          className={`rounded-2xl bg-card border border-line p-5 sm:p-6 ${
            detailOpen
              ? "flex flex-col gap-4"
              : "hidden expanded:flex expanded:flex-col"
          }`}
        >
          <button
            type="button"
            onClick={() => setDetailOpen(false)}
            className="expanded:hidden self-start inline-flex items-center gap-2 text-sm text-brand-hover"
          >
            <ArrowLeftIcon size={16} />
            Ro'yxatga qaytish
          </button>

          <CourseDetail course={selected} />

          <button
            type="button"
            className="mt-2 self-start inline-flex items-center gap-2 rounded-xl bg-brand text-on-brand font-medium px-5 py-3 hover:bg-brand-hover transition-colors"
          >
            <PlayIcon size={16} />
            {selected.progress > 0 ? "Davom etish" : "Kursni boshlash"}
          </button>
        </section>
      </div>
    </div>
  );
}
