import { useId } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courses, type Course } from '@/entities/course'
import { ApplicationForm } from '@/features/submit-application'
import { paths } from '@/shared/config/routes'
import { useSearchParamState } from '@/shared/lib'
import { CourseCurriculum } from './detail/CourseCurriculum'
import { CourseHero } from './detail/CourseHero'
import { CourseOverview } from './detail/CourseOverview'
import { CourseReviews } from './detail/CourseReviews'
import { CourseSidebar } from './detail/CourseSidebar'
import { CourseTabs, type Tab } from './detail/CourseTabs'

const ABOUT = 'about'
const APPLYING = '1'

function Breadcrumb({ course }: { course: Course }) {
  return (
    <nav aria-label="Yo'nalish">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <li>
          <Link to={paths.courses} className="hover:text-ink">
            Barcha kurslar
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          <Link
            to={`${paths.courses}?category=${encodeURIComponent(course.category)}`}
            className="hover:text-ink"
          >
            {course.category}
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li aria-current="page" className="text-ink">
          {course.title}
        </li>
      </ol>
    </nav>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="font-display text-2xl font-bold text-ink">Kurs topilmadi</h1>
      <p className="text-ink-muted">
        Bu kurs olib tashlangan bo'lishi mumkin. Katalogdan boshqasini tanlang.
      </p>
      <Link
        to={paths.courses}
        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-hover"
      >
        Barcha kurslarga qaytish
      </Link>
    </div>
  )
}

export function CourseDetailPage() {
  const { courseId } = useParams()
  const course = courses.find((item) => item.id === courseId)

  const baseId = useId()
  const tabs: Tab[] = [
    { id: ABOUT, label: 'Kurs haqida' },
    { id: 'curriculum', label: "O'quv dasturi" },
    { id: 'reviews', label: `Sharhlar (${course?.reviews.length ?? 0})` },
  ]
  // The open tab rides in the URL, so a specific section can be linked.
  const [activeTab, setActiveTab] = useSearchParamState('tab', {
    fallback: ABOUT,
    allowed: tabs.map((tab) => tab.id),
  })
  // The form opens in place on this page rather than on a route of its own, so
  // the back button closes it and the chosen tab is still there underneath.
  const [applying, setApplying] = useSearchParamState('apply', { allowed: [APPLYING] })

  if (!course) return <NotFound />

  if (applying === APPLYING) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <Breadcrumb course={course} />
        <ApplicationForm course={course} onCancel={() => setApplying('')} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb course={course} />
      <CourseHero course={course} onApply={() => setApplying(APPLYING)} />

      <div className="grid gap-6 large:grid-cols-[minmax(0,1fr)_minmax(0,320px)] large:items-start">
        <div className="flex flex-col gap-6">
          <CourseTabs tabs={tabs} active={activeTab} onChange={setActiveTab} baseId={baseId} />

          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={`${baseId}-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${tab.id}`}
              hidden={tab.id !== activeTab}
            >
              {tab.id === ABOUT ? <CourseOverview course={course} /> : null}
              {tab.id === 'curriculum' ? <CourseCurriculum course={course} /> : null}
              {tab.id === 'reviews' ? <CourseReviews course={course} /> : null}
            </div>
          ))}
        </div>

        <CourseSidebar mentor={course.mentor} requirements={course.requirements} />
      </div>
    </div>
  )
}
