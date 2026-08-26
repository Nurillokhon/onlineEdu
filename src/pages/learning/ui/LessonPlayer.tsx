import { useEffect, useRef, useState } from 'react'
import { type Lesson } from '@/entities/course'
import { WATCHED_THRESHOLD } from '@/entities/enrollment'
import { PlayIcon } from '@/shared/ui'

interface LessonPlayerProps {
  lesson: Lesson
  poster: string
  /** Seconds already credited by the server, at mount. */
  watchedSeconds: number
  /** True once the server has accepted the lesson video as watched. */
  completed: boolean
  onSave: (payload: { watchedSeconds: number; duration: number }) => void
  /** Reports the locally measured fraction, so the page can open the quiz. */
  onFractionChange: (fraction: number) => void
}

/** Autosave cadence while the video plays. */
const SAVE_INTERVAL_MS = 10_000
const NOTICE_MS = 2600

/**
 * The lesson video and its watch gate.
 *
 * Credit is counted per whole second actually played, held in a set, so
 * dragging the scrubber cannot buy progress. Until the lesson is credited the
 * player also refuses to seek past the furthest second reached — the point of
 * the rule is that the video gets watched, and a timeline that can be dragged
 * to the end makes it decorative. Once credited every control is unrestricted,
 * because re-watching should be easy.
 *
 * This is a client-side gate. It is honest about intent, not tamper-proof: the
 * server has the final say on `completed`.
 */
export function LessonPlayer({
  lesson,
  poster,
  watchedSeconds,
  completed,
  onSave,
  onFractionChange,
}: LessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // Unique whole seconds played. Its size is the watched total.
  const watchedRef = useRef(new Set<number>())
  // Furthest second reached: the seek frontier while the gate is closed.
  const frontierRef = useRef(0)
  const correctingRef = useRef(false)
  const dirtyRef = useRef(false)
  const saveRef = useRef(onSave)
  const fractionRef = useRef(onFractionChange)
  // Snapshot: the component is keyed by lesson, so this is the lesson's own.
  const initialWatched = useRef(watchedSeconds).current

  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    saveRef.current = onSave
    fractionRef.current = onFractionChange
  })

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), NOTICE_MS)
    return () => clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    const video = videoRef.current
    if (!video || completed) return

    function flush() {
      if (!video || !dirtyRef.current) return
      dirtyRef.current = false
      const duration = Number.isFinite(video.duration) ? Math.floor(video.duration) : lesson.duration
      saveRef.current({ watchedSeconds: watchedRef.current.size, duration })
    }

    function report() {
      if (!video) return
      const duration = Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : lesson.duration
      fractionRef.current(Math.min(1, watchedRef.current.size / duration))
    }

    function onLoadedMetadata() {
      if (!video) return
      // Credit already earned is replayed as the opening stretch of the video,
      // which is where a linear watcher earned it. It keeps the seek frontier
      // in the right place across reloads.
      const duration = Number.isFinite(video.duration) ? Math.floor(video.duration) : 0
      const seeded = Math.min(Math.floor(initialWatched), duration)
      for (let second = 0; second < seeded; second += 1) watchedRef.current.add(second)
      frontierRef.current = seeded
      report()
    }

    function onTimeUpdate() {
      if (!video || correctingRef.current) return
      const second = Math.floor(video.currentTime)
      if (!watchedRef.current.has(second)) {
        watchedRef.current.add(second)
        dirtyRef.current = true
      }
      if (second + 1 > frontierRef.current) frontierRef.current = second + 1
      report()
    }

    function onSeeking() {
      if (!video || correctingRef.current) return
      // One second of slack: the browser nudges currentTime on its own.
      if (video.currentTime <= frontierRef.current + 1) return
      correctingRef.current = true
      video.currentTime = Math.max(0, frontierRef.current - 0.5)
      setNotice("Videoni birinchi marta oldinga o'tkazib bo'lmaydi.")
    }

    function onSeeked() {
      correctingRef.current = false
    }

    function onEnded() {
      flush()
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('seeking', onSeeking)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('pause', flush)
    video.addEventListener('ended', onEnded)
    const timer = setInterval(flush, SAVE_INTERVAL_MS)

    if (video.readyState >= 1) onLoadedMetadata()

    return () => {
      clearInterval(timer)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('seeking', onSeeking)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('pause', flush)
      video.removeEventListener('ended', onEnded)
      flush()
    }
  }, [completed, initialWatched, lesson.duration])

  function start() {
    setStarted(true)
    // Autoplay can still be refused; the native controls are showing by then.
    videoRef.current?.play().catch(() => undefined)
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-ink">
      <video
        ref={videoRef}
        src={lesson.videoUrl}
        poster={poster}
        controls={started && !failed}
        preload="metadata"
        playsInline
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />

      {failed ? (
        <p className="absolute inset-x-0 bottom-0 bg-ink/75 px-4 py-3 text-center text-sm text-on-brand">
          Video hozircha yuklanmadi. Internet aloqasini tekshiring.
        </p>
      ) : started ? null : (
        <button
          type="button"
          onClick={start}
          aria-label={`${lesson.number} ${lesson.title} — videoni ko'rish`}
          className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors hover:bg-ink/35"
        >
          <span className="grid size-16 place-items-center rounded-full bg-surface/95 text-brand shadow-lg">
            <PlayIcon size={24} />
          </span>
        </button>
      )}

      {notice ? (
        <p
          role="status"
          className="absolute inset-x-4 bottom-16 mx-auto max-w-sm rounded-xl bg-ink/85 px-4 py-2.5 text-center text-sm text-on-brand"
        >
          {notice}
        </p>
      ) : null}

      {completed ? null : (
        <span className="sr-only">
          Test uchun videoning kamida {Math.round(WATCHED_THRESHOLD * 100)} foizini ko'rish kerak.
        </span>
      )}
    </div>
  )
}
