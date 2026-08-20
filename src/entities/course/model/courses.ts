import dataScienceCover from '@/shared/assets/dataScience.png'
import frontendCover from '@/shared/assets/frontend.png'
import systemDesignCover from '@/shared/assets/tizimDizayni.png'
import uxUiCover from '@/shared/assets/uxuiDizayn.png'

export interface Course {
  id: string
  title: string
  mentor: string
  /** Shown as the card eyebrow and drives the catalogue filter. */
  category: string
  cover: string
  /** 0–100. */
  progress: number
  lessons: number
  hours: number
  /** Enrolled learners, shown on the catalogue card. */
  students: number
  summary: string
  topics: string[]
}

// Demo data — replace with a request once the courses API exists.
export const courses: Course[] = [
  {
    id: 'system-design',
    title: 'Tizim dizayni',
    mentor: 'Bahodir Ergashev',
    category: 'Muhandislik',
    cover: systemDesignCover,
    progress: 62,
    lessons: 24,
    hours: 18,
    students: 1250,
    summary:
      'Katta yuklamali tizimlarni loyihalash: masshtablash, keshlash, navbatlar va ma’lumotlar bazasini tanlash.',
    topics: ['Masshtablash', 'Keshlash', 'Navbatlar', 'Monitoring'],
  },
  {
    id: 'frontend',
    title: 'Frontend: React va TypeScript',
    mentor: 'Malika Rustamova',
    category: 'Dasturlash',
    cover: frontendCover,
    progress: 38,
    lessons: 32,
    hours: 26,
    students: 3420,
    summary:
      'Komponent arxitekturasi, holat boshqaruvi va interfeys testlari. Har mavzudan keyin amaliy loyiha.',
    topics: ['React', 'TypeScript', 'Holat boshqaruvi', 'Testlar'],
  },
  {
    id: 'data-science',
    title: 'Data Science asoslari',
    mentor: 'Otabek Karimov',
    category: 'Ma’lumotlar tahlili',
    cover: dataScienceCover,
    progress: 12,
    lessons: 28,
    hours: 22,
    students: 850,
    summary:
      'Python bilan ma’lumotlarni tahlil qilish, vizualizatsiya va birinchi mashinali o’qitish modellari.',
    topics: ['Python', 'Pandas', 'Vizualizatsiya', 'ML asoslari'],
  },
  {
    id: 'ux-ui',
    title: 'UX/UI dizayn',
    mentor: 'Nodira Aliyeva',
    category: 'Dizayn',
    cover: uxUiCover,
    progress: 0,
    lessons: 20,
    hours: 15,
    students: 5100,
    summary:
      'Foydalanuvchi tadqiqotidan dizayn tizimigacha: Figma, prototiplar va portfolio himoyasi.',
    topics: ['Tadqiqot', 'Figma', 'Dizayn tizimi', 'Portfolio'],
  },
]

/** Chip order for the catalogue filter, derived so new courses show up on their own. */
export const courseCategories = Array.from(new Set(courses.map((course) => course.category)))
