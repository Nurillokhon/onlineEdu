import { useMemo } from 'react'
import { CourseCard, courseCategories, courses } from '@/entities/course'
import { courseDetailPath } from '@/shared/config/routes'
import { useClearSearchParams, useSearchParamState } from '@/shared/lib'
import { SearchIcon } from '@/shared/ui'

const ALL = 'Barchasi'

/** Course catalogue: a searchable, filterable grid driven by the query string. */
export function CoursesPage() {
  const [category, setCategory] = useSearchParamState('category', {
    fallback: ALL,
    allowed: courseCategories,
  })
  const [query, setQuery] = useSearchParamState('q')
  const clearFilters = useClearSearchParams()

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesCategory = category === ALL || course.category === category
      const matchesQuery =
        needle === '' ||
        course.title.toLowerCase().includes(needle) ||
        course.mentor.toLowerCase().includes(needle) ||
        course.category.toLowerCase().includes(needle)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 medium:flex-row medium:items-end medium:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-bold text-ink">Barcha kurslar</h1>
          <p className="text-ink-muted">
            O'z malakangizni oshirish uchun eng yaxshi kurslarni tanlang.
          </p>
        </div>

        <div className="relative medium:w-72 large:w-80">
          {/* Decorative: the input carries the accessible name. */}
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-muted">
            <SearchIcon size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kurslarni qidirish..."
            aria-label="Kurslarni qidirish"
            className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brand-hover focus:outline-none"
          />
        </div>
      </div>

      <div
        role="group"
        aria-label="Kategoriya bo'yicha saralash"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {[ALL, ...courseCategories].map((name) => {
          const active = name === category
          return (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              aria-pressed={active}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'border-brand bg-brand text-on-brand'
                  : 'border-line bg-surface text-ink hover:border-brand-hover'
              }`}
            >
              {name}
            </button>
          )
        })}
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 medium:grid-cols-2 expanded:grid-cols-3 large:grid-cols-4">
          {visible.map((course) => (
            <CourseCard key={course.id} course={course} to={courseDetailPath(course.id)} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-card p-10 text-center">
          <p className="font-medium text-ink">Bu so'rov bo'yicha kurs topilmadi.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Boshqa kalit so'zni kiriting yoki kategoriyani "Barchasi"ga qaytaring.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
          >
            Filtrlarni tozalash
          </button>
        </div>
      )}
    </div>
  )
}
