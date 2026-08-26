/**
 * A lesson and its transcript. The real content comes from the backend; the
 * shapes here are what the player renders, and {@link buildLessons} only fills
 * them with demo text until the courses API exists.
 */

/** One block of the lesson transcript, rendered under the video. */
export type TranscriptBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'callout'; title: string; text: string }

export interface Lesson {
  id: string
  /** Display number, e.g. "1.2" — the module index and the lesson index. */
  number: string
  title: string
  videoUrl: string
  /** Seconds. Drives the outline duration and the watched-fraction gate. */
  duration: number
  transcript: TranscriptBlock[]
  /**
   * The quiz that gates the next lesson. Every lesson has one; the questions
   * themselves are fetched separately, since only the backend may hold the
   * correct answers.
   */
  quizId: string
}

/** "12:45" from a duration in seconds. */
export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

// Demo transcripts, so the panel under the player is never empty. The backend
// replaces these wholesale — nothing reads their wording.
function demoTranscript(title: string): TranscriptBlock[] {
  return [
    {
      kind: 'paragraph',
      text: `${title} — ushbu darsda mavzuning asosiy tushunchalari va ular amaliyotda qanday qo'llanilishi ko'rib chiqiladi. Har bir qoida real misol bilan tahlil qilinadi.`,
    },
    {
      kind: 'callout',
      title: 'Muhim qoida',
      text: "Nazariyani o'qib chiqish yetarli emas: har bir bo'limdan keyin o'zingizni tekshirib boring, shunda keyingi mavzu ancha oson o'zlashtiriladi.",
    },
    {
      kind: 'paragraph',
      text: "Dars oxirida qisqa test topshiriladi. Test natijasi keyingi darsni ochadi, shuning uchun videoni oxirigacha ko'rib chiqing va qaydlarni yozib boring.",
    },
  ]
}

// Lesson lengths repeat on a short cycle, so the outline shows a believable
// mix of durations without anybody hand-picking a number per lesson.
const DEMO_DURATIONS = [500, 765, 910, 620, 1210, 840]

/** Turns a module's lesson titles into full lessons for the demo data. */
export function buildLessons(
  moduleIndex: number,
  videoUrl: string,
  titles: string[],
): Lesson[] {
  return titles.map((title, index) => {
    const number = `${moduleIndex + 1}.${index + 1}`
    return {
      id: `m${moduleIndex + 1}-l${index + 1}`,
      number,
      title,
      videoUrl,
      duration: DEMO_DURATIONS[(moduleIndex + index) % DEMO_DURATIONS.length],
      transcript: demoTranscript(title),
      quizId: `quiz-${number}`,
    }
  })
}
