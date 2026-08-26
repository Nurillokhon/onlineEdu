import { useAuth, useProfileStatsQuery } from "@/entities/user";
import { courses } from "@/entities/course";
import { useCourseProgressMap } from "@/entities/enrollment";
import { Spinner } from "@/shared/ui";
import { formatPhone, toPhoneDigits } from "@/shared/lib";

/**
 * Material 3 supporting pane canonical layout: the profile is the focus pane,
 * with stats and activity in a supporting pane beside it on wide windows.
 */
export function ProfilePage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useProfileStatsQuery();
  const { progressOf } = useCourseProgressMap();

  const phone = user?.phone ? formatPhone(toPhoneDigits(user.phone)) : null;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-ink">Profil</h1>
      <div className="expanded:grid expanded:grid-cols-[minmax(0,1fr)_minmax(0,320px)] gap-6 flex flex-col">
        <section className="rounded-2xl bg-card border border-line p-5 sm:p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-2xl bg-brand-soft text-brand text-lg font-semibold flex items-center justify-center">
              {(user?.name ?? "EF").slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                {user?.name ?? "Foydalanuvchi"}
              </h2>
              <p className="text-ink-muted text-sm">
                {user?.email ?? phone ?? "—"}
              </p>
            </div>
          </div>

          <dl className="grid medium:grid-cols-2 gap-4">
            <div className="rounded-xl bg-brand-softer px-4 py-3">
              <dt className="text-ink-muted text-sm">Telefon</dt>
              <dd className="text-ink">{phone ?? "Kiritilmagan"}</dd>
            </div>
            <div className="rounded-xl bg-brand-softer px-4 py-3">
              <dt className="text-ink-muted text-sm">Elektron pochta</dt>
              <dd className="text-ink">{user?.email ?? "Kiritilmagan"}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3">
            <h3 className="font-display text-lg font-semibold text-ink">
              Kurslardagi natijalar
            </h3>
            {courses.map((course) => {
              const progress = progressOf(course)
              return (
                <div key={course.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">{course.title}</span>
                    <span className="text-ink-muted">{progress.percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-line overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-brand"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <aside
          aria-label="Statistika"
          className="rounded-2xl bg-card border border-line p-5 sm:p-6 flex flex-col gap-4 h-fit"
        >
          <h3 className="font-display text-lg font-semibold text-ink">
            Statistika
          </h3>
          {isLoading ? (
            <Spinner label="Statistika yuklanmoqda…" />
          ) : isError ? (
            <p className="text-danger text-sm">
              Statistikani yuklashda xatolik yuz berdi.
            </p>
          ) : (
            <dl className="flex flex-col gap-3">
              {[
                { label: "Tugatilgan kurslar", value: data?.coursesCompleted },
                { label: "O'rganilgan soatlar", value: data?.hoursLearned },
                { label: "Kunlik seriya", value: data?.streakDays },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between"
                >
                  <dt className="text-ink-muted text-sm">{stat.label}</dt>
                  <dd className="text-ink text-lg font-semibold">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </aside>
      </div>
    </div>
  );
}
