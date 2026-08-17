import { ImagePlaceholder } from './ImagePlaceholder'
import { containerClass } from './container'

const mentors = [
  { name: 'Malika Rustamova', role: 'Frontend Dasturchi' },
  { name: 'Otabek Karimov', role: 'Data Science' },
  { name: 'Nodira Aliyeva', role: 'UX/UI Dizayner' },
  { name: 'Jamshid Qodirov', role: 'Backend Dasturchi' },
]

export function MentorsSection() {
  return (
    <section id="mentorlar" className={`${containerClass} mt-16`}>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink text-center mb-10">
        Professional Mentorlar
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mentors.map((mentor) => (
          <div key={mentor.name} className="flex flex-col gap-3">
            <ImagePlaceholder alt={mentor.name} className="w-full aspect-square rounded-2xl" />
            <div className="text-center">
              <p className="font-semibold text-ink">{mentor.name}</p>
              <p className="text-ink-muted text-sm">{mentor.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
