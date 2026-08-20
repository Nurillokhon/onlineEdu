import { useRef, useState } from 'react'
import { PlayIcon } from '@/shared/ui'

interface CourseVideoProps {
  src: string
  poster: string
  /** Names the play button, so the control says which course it starts. */
  title: string
}

/**
 * Course intro reel. The cover stands in as the poster and nothing is fetched
 * until the learner presses play, so the page does not pay for a video most
 * visitors never start.
 */
export function CourseVideo({ src, poster, title }: CourseVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)

  function start() {
    setStarted(true)
    // Autoplay can still be refused; the native controls are showing by then,
    // so the learner can press play again themselves.
    videoRef.current?.play().catch(() => undefined)
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-ink">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={started && !failed}
        preload="none"
        playsInline
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />

      {failed ? (
        // The clip is hosted elsewhere, so say so rather than leaving a dead
        // control sitting over the poster.
        <p className="absolute inset-x-0 bottom-0 bg-ink/75 px-4 py-3 text-center text-sm text-on-brand">
          Video hozircha yuklanmadi. Internet aloqasini tekshiring.
        </p>
      ) : started ? null : (
        <button
          type="button"
          onClick={start}
          aria-label={`${title} — kirish videosini ko'rish`}
          className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors hover:bg-ink/35"
        >
          <span className="grid size-16 place-items-center rounded-full bg-surface/95 text-brand shadow-lg">
            <PlayIcon size={24} />
          </span>
        </button>
      )}
    </div>
  )
}
