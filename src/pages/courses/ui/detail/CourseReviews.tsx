import { averageRating, type Course, type Review } from '@/entities/course'
import { StarIcon } from '@/shared/ui'

/** ISO date to the day-first form used across the app. */
function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-brand' : 'text-line'}>
          <StarIcon size={15} />
        </span>
      ))}
    </span>
  )
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="rounded-2xl border border-line bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
            {review.author.charAt(0)}
          </span>
          <div>
            <p className="font-medium text-ink">{review.author}</p>
            <Stars rating={review.rating} label={`5 balldan ${review.rating}`} />
          </div>
        </div>
        <time dateTime={review.date} className="text-sm text-ink-muted">
          {formatDate(review.date)}
        </time>
      </div>
      <p className="mt-3 leading-relaxed text-ink-muted">{review.text}</p>
    </li>
  )
}

/** The "Sharhlar" panel: the average score, then every review. */
export function CourseReviews({ course }: { course: Course }) {
  const average = averageRating(course)

  if (course.reviews.length === 0) {
    return (
      <section className="rounded-2xl border border-line bg-card p-10 text-center">
        <p className="font-medium text-ink">Bu kursda hali sharh yo'q.</p>
        <p className="mt-1 text-sm text-ink-muted">
          Kursni tamomlaganingizdan keyin birinchi sharhni siz qoldirasiz.
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-bold text-ink">Sharhlar</h2>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-sm text-ink">
          <Stars rating={Math.round(average)} label={`O'rtacha baho: 5 balldan ${average}`} />
          {average} • {course.reviews.length} ta sharh
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {course.reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </section>
  )
}
