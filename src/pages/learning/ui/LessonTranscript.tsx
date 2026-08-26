import type { TranscriptBlock } from '@/entities/course'

/**
 * The text version of the lesson. It stays readable before the video is
 * finished: the gate is on the video and the quiz, and withholding the
 * transcript would only punish learners who read faster than they watch.
 */
export function LessonTranscript({ blocks }: { blocks: TranscriptBlock[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 sm:p-6">
      <h2 className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
        Dars matni va qaydlar
      </h2>

      {blocks.map((block, index) =>
        block.kind === 'callout' ? (
          <div
            key={index}
            className="border-l-4 border-brand bg-brand-softer/60 py-3 pr-4 pl-4 rounded-r-xl"
          >
            <p className="font-semibold text-ink">{block.title}:</p>
            <p className="mt-1 text-sm text-ink-muted">{block.text}</p>
          </div>
        ) : (
          <p key={index} className="text-ink leading-relaxed">
            {block.text}
          </p>
        ),
      )}
    </section>
  )
}
