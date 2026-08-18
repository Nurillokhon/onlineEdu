export interface Course {
  id: string
  title: string
  mentor: string
  /** 0–100. */
  progress: number
  lessons: number
  hours: number
  summary: string
  topics: string[]
}

// Demo data — replace with a request once the courses API exists.
export const courses: Course[] = [
  {
    id: 'system-design',
    title: 'Tizim dizayni',
    mentor: 'Bahodir Ergashev',
    progress: 62,
    lessons: 24,
    hours: 18,
    summary:
      'Katta yuklamali tizimlarni loyihalash: masshtablash, keshlash, navbatlar va ma’lumotlar bazasini tanlash.',
    topics: ['Masshtablash', 'Keshlash', 'Navbatlar', 'Monitoring'],
  },
  {
    id: 'frontend',
    title: 'Frontend: React va TypeScript',
    mentor: 'Malika Rustamova',
    progress: 38,
    lessons: 32,
    hours: 26,
    summary:
      'Komponent arxitekturasi, holat boshqaruvi va interfeys testlari. Har mavzudan keyin amaliy loyiha.',
    topics: ['React', 'TypeScript', 'Holat boshqaruvi', 'Testlar'],
  },
  {
    id: 'data-science',
    title: 'Data Science asoslari',
    mentor: 'Otabek Karimov',
    progress: 12,
    lessons: 28,
    hours: 22,
    summary:
      'Python bilan ma’lumotlarni tahlil qilish, vizualizatsiya va birinchi mashinali o’qitish modellari.',
    topics: ['Python', 'Pandas', 'Vizualizatsiya', 'ML asoslari'],
  },
  {
    id: 'ux-ui',
    title: 'UX/UI dizayn',
    mentor: 'Nodira Aliyeva',
    progress: 0,
    lessons: 20,
    hours: 15,
    summary:
      'Foydalanuvchi tadqiqotidan dizayn tizimigacha: Figma, prototiplar va portfolio himoyasi.',
    topics: ['Tadqiqot', 'Figma', 'Dizayn tizimi', 'Portfolio'],
  },
]
