import dataScienceCover from '@/shared/assets/dataScience.png'
import frontendCover from '@/shared/assets/frontend.png'
import systemDesignCover from '@/shared/assets/tizimDizayni.png'
import uxUiCover from '@/shared/assets/uxuiDizayn.png'

export interface Mentor {
  name: string
  role: string
  bio: string
}

export interface CurriculumModule {
  title: string
  lessons: number
  /** Human-readable, e.g. "1 soat 15 daqiqa". */
  duration: string
  /** Lesson titles, revealed when the module is expanded. */
  topics: string[]
}

export interface Requirement {
  text: string
  /** Picks the row icon: prior knowledge versus kit the learner needs. */
  kind: 'knowledge' | 'equipment'
}

export interface Review {
  id: string
  author: string
  /** 1–5. */
  rating: number
  date: string
  text: string
}

export interface Course {
  id: string
  title: string
  /** Shown as the card eyebrow, the breadcrumb crumb, and the catalogue filter. */
  category: string
  cover: string
  /** Course intro reel. Placeholder clips until real ones are uploaded. */
  videoUrl: string
  level: string
  mentor: Mentor
  /** 0–100. */
  progress: number
  hours: number
  students: number
  certificate: boolean
  /** One line for the catalogue card. */
  summary: string
  /** Paragraphs for the detail page description. */
  description: string[]
  outcomes: string[]
  requirements: Requirement[]
  curriculum: CurriculumModule[]
  reviews: Review[]
  topics: string[]
}

// Freely reusable sample clips, so the player has something real to show until
// the studio uploads the actual intros. The gtv-videos-bucket samples are not
// usable here: that host serves them in a way browsers reject (ERR_BLOCKED_BY_ORB).
const CC0_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos'
const CDN_VIDEO = 'https://cdn.jsdelivr.net/gh/mediaelement/mediaelement-files@master'

// Demo data — replace with a request once the courses API exists.
export const courses: Course[] = [
  {
    id: 'system-design',
    title: 'Tizim dizayni',
    category: 'Muhandislik',
    cover: systemDesignCover,
    videoUrl: `${CDN_VIDEO}/big_buck_bunny.mp4`,
    level: "O'rta daraja",
    mentor: {
      name: 'Bahodir Ergashev',
      role: 'Senior Backend Engineer',
      bio: "12 yillik tajribaga ega muhandis. Milliy to'lov tizimlarida yuqori yuklamali servislarni loyihalagan.",
    },
    progress: 62,
    hours: 18,
    students: 1250,
    certificate: true,
    summary:
      'Katta yuklamali tizimlarni loyihalash: masshtablash, keshlash, navbatlar va ma’lumotlar bazasini tanlash.',
    description: [
      "Tizim dizayni — bu talablardan kelib chiqib arxitektura tanlash san'ati. Ushbu kurs sizga yuz minglab foydalanuvchiga xizmat qiladigan servislarni noldan loyihalashni o'rgatadi.",
      "Kurs davomida siz masshtablash strategiyalari, keshlash qatlamlari va navbatlar bilan ishlaysiz. Har bir mavzu real ishlab chiqarish hodisalari misolida tahlil qilinadi.",
    ],
    outcomes: [
      "Talablardan arxitektura diagrammasi tuzish",
      "Gorizontal va vertikal masshtablashni tanlash",
      "Keshlash qatlamlarini to'g'ri joylashtirish",
      "Ma'lumotlar bazasini vazifaga qarab tanlash",
    ],
    requirements: [
      { text: 'Bitta backend tilida amaliy tajriba', kind: 'knowledge' },
      { text: "Ma'lumotlar bazalari bo'yicha asosiy bilim", kind: 'knowledge' },
    ],
    curriculum: [
      {
        title: 'Kirish: tizim dizayni nima?',
        lessons: 3,
        duration: '1 soat 15 daqiqa',
        topics: ['Talablarni yig\'ish', 'Cheklovlarni baholash', 'Birinchi diagramma'],
      },
      {
        title: 'Masshtablash strategiyalari',
        lessons: 5,
        duration: '2 soat 30 daqiqa',
        topics: ['Yuk balanslash', 'Shardlash', 'Replikatsiya', 'Xatoliklarga chidamlilik', 'Amaliyot'],
      },
      {
        title: 'Keshlash va navbatlar',
        lessons: 4,
        duration: '2 soat',
        topics: ['Kesh qatlamlari', 'Invalidatsiya', 'Xabar navbatlari', 'Amaliyot'],
      },
      {
        title: 'Monitoring va ishonchlilik',
        lessons: 4,
        duration: '1 soat 45 daqiqa',
        topics: ['Metrikalar', 'Loglar', 'Ogohlantirishlar', 'Post-mortem'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Jasur Toshmatov',
        rating: 5,
        date: '2026-05-14',
        text: "Diagrammalar bilan ishlash qismi juda kuchli. Ishda darhol qo'llay boshladim.",
      },
      {
        id: 'r2',
        author: 'Dilnoza Sattorova',
        rating: 4,
        date: '2026-04-02',
        text: "Keshlash moduli ajoyib. Navbatlar mavzusiga yana bir nechta misol qo'shilsa zo'r bo'lardi.",
      },
    ],
    topics: ['Masshtablash', 'Keshlash', 'Navbatlar', 'Monitoring'],
  },
  {
    id: 'frontend',
    title: 'Frontend: React va TypeScript',
    category: 'Dasturlash',
    cover: frontendCover,
    videoUrl: `${CC0_VIDEO}/flower.mp4`,
    level: "Boshlang'ich daraja",
    mentor: {
      name: 'Malika Rustamova',
      role: 'Lead Frontend Engineer',
      bio: "8 yillik tajribaga ega mutaxassis. Yirik marketplace interfeyslarini va ichki dizayn tizimlarini ishlab chiqqan.",
    },
    progress: 38,
    hours: 26,
    students: 3420,
    certificate: true,
    summary:
      'Komponent arxitekturasi, holat boshqaruvi va interfeys testlari. Har mavzudan keyin amaliy loyiha.',
    description: [
      "React va TypeScript bugungi frontend ishlab chiqishning asosiy vositalari. Ushbu kurs ularni noldan, amaliyot orqali o'rgatadi.",
      "Kurs davomida siz komponent arxitekturasini quryapsiz, holat boshqaruvini tanlaysiz va interfeys testlarini yozasiz. Har bir modul oxirida mentordan kod izohi olasiz.",
    ],
    outcomes: [
      'Qayta ishlatiladigan komponentlar yozish',
      "TypeScript bilan xavfsiz interfeys qurish",
      'Holat boshqaruvi vositasini tanlash',
      'Interfeys testlarini yozish',
    ],
    requirements: [
      { text: 'HTML, CSS va JavaScript asoslari', kind: 'knowledge' },
      { text: 'Shaxsiy kompyuter va internet aloqasi', kind: 'equipment' },
    ],
    curriculum: [
      {
        title: 'Kirish: React nima?',
        lessons: 3,
        duration: '1 soat 15 daqiqa',
        topics: ['Komponent tushunchasi', 'JSX', 'Birinchi loyiha'],
      },
      {
        title: 'TypeScript bilan ishlash',
        lessons: 5,
        duration: '2 soat 30 daqiqa',
        topics: ['Turlar', 'Generiklar', 'Props tiplari', 'Utility turlar', 'Amaliyot'],
      },
      {
        title: 'Holat boshqaruvi',
        lessons: 6,
        duration: '3 soat',
        topics: ['useState', 'useReducer', 'Kontekst', 'Zustand', 'React Query', 'Amaliyot'],
      },
      {
        title: 'Testlar va yakuniy loyiha',
        lessons: 4,
        duration: '2 soat 10 daqiqa',
        topics: ['Testing Library', 'Mocklar', 'CI', 'Portfolio himoyasi'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Sardor Aliyev',
        rating: 5,
        date: '2026-06-01',
        text: "Amaliy loyihalar ko'p. Mentor izohlari haqiqatan ham foydali bo'ldi.",
      },
      {
        id: 'r2',
        author: 'Kamola Yusupova',
        rating: 5,
        date: '2026-03-19',
        text: "TypeScript moduli tushunarli tushuntirilgan. Ishda darhol foydalandim.",
      },
    ],
    topics: ['React', 'TypeScript', 'Holat boshqaruvi', 'Testlar'],
  },
  {
    id: 'data-science',
    title: 'Data Science asoslari',
    category: 'Ma’lumotlar tahlili',
    cover: dataScienceCover,
    videoUrl: `${CC0_VIDEO}/friday.mp4`,
    level: "Boshlang'ich daraja",
    mentor: {
      name: 'Otabek Karimov',
      role: 'Data Scientist',
      bio: "10 yillik tajribaga ega mutaxassis. Bank va telekom sohalarida bashoratli modellar qurgan.",
    },
    progress: 12,
    hours: 22,
    students: 850,
    certificate: true,
    summary:
      'Python bilan ma’lumotlarni tahlil qilish, vizualizatsiya va birinchi mashinali o’qitish modellari.',
    description: [
      "Data Science — bu ma'lumotdan qaror chiqarish jarayoni. Ushbu kurs sizga Python yordamida ma'lumotni yig'ish, tozalash va tahlil qilishni o'rgatadi.",
      "Kurs davomida siz real ma'lumotlar to'plamlari bilan ishlaysiz, vizualizatsiya quryapsiz va birinchi mashinali o'qitish modelingizni o'qitasiz.",
    ],
    outcomes: [
      "Ma'lumotlarni yig'ish va tozalash texnikalari",
      'Pandas bilan tahlil qilish',
      "Natijani vizualizatsiya orqali tushuntirish",
      "Birinchi ML modelini o'qitish va baholash",
    ],
    requirements: [
      { text: "Boshlang'ich matematika va statistika bilimlari", kind: 'knowledge' },
      { text: 'Shaxsiy kompyuter va internet aloqasi', kind: 'equipment' },
    ],
    curriculum: [
      {
        title: 'Kirish: Data Science nima?',
        lessons: 3,
        duration: '1 soat 20 daqiqa',
        topics: ['Soha haqida', 'Vositalar', 'Muhitni sozlash'],
      },
      {
        title: "Ma'lumotlarni tozalash",
        lessons: 5,
        duration: '2 soat 30 daqiqa',
        topics: ['Pandas asoslari', "Yo'q qiymatlar", 'Dublikatlar', 'Birlashtirish', 'Amaliyot'],
      },
      {
        title: 'Vizualizatsiya',
        lessons: 4,
        duration: '1 soat 50 daqiqa',
        topics: ['Matplotlib', 'Seaborn', 'Grafik tanlash', 'Amaliyot'],
      },
      {
        title: 'Birinchi ML model',
        lessons: 5,
        duration: '2 soat 40 daqiqa',
        topics: ['Regressiya', 'Klassifikatsiya', 'Baholash', 'Overfitting', 'Yakuniy loyiha'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Nodir Ismoilov',
        rating: 4,
        date: '2026-05-28',
        text: "Tozalash moduli kutganimdan kuchli chiqdi. ML qismi biroz tez o'tildi.",
      },
      {
        id: 'r2',
        author: 'Shahnoza Rahimova',
        rating: 5,
        date: '2026-02-11',
        text: "Real ma'lumotlar bilan ishlash juda foydali. Portfolio uchun ikkita loyiha yig'dim.",
      },
    ],
    topics: ['Python', 'Pandas', 'Vizualizatsiya', 'ML asoslari'],
  },
  {
    id: 'ux-ui',
    title: 'UX/UI dizayn',
    category: 'Dizayn',
    cover: uxUiCover,
    videoUrl: `${CDN_VIDEO}/echo-hereweare.mp4`,
    level: "Boshlang'ich daraja",
    mentor: {
      name: 'Nodira Aliyeva',
      role: 'Product Designer',
      bio: "9 yillik tajribaga ega dizayner. Fintech mahsulotlari uchun dizayn tizimlarini qurgan va jamoalarni o'qitgan.",
    },
    progress: 0,
    hours: 15,
    students: 5100,
    certificate: true,
    summary:
      'Foydalanuvchi tadqiqotidan dizayn tizimigacha: Figma, prototiplar va portfolio himoyasi.',
    description: [
      "UX/UI dizayn — foydalanuvchi ehtiyojini tushunib, uni aniq interfeysga aylantirish jarayoni. Ushbu kurs shu yo'lni boshidan oxirigacha bosib o'tadi.",
      "Kurs davomida siz tadqiqot o'tkazasiz, prototip quryapsiz va dizayn tizimini yig'asiz. Yakunda tayyor portfolio loyihasini himoya qilasiz.",
    ],
    outcomes: [
      "Foydalanuvchi intervyusini o'tkazish",
      'Figma’da prototip qurish',
      'Dizayn tizimi komponentlarini tuzish',
      'Portfolio loyihasini taqdim qilish',
    ],
    requirements: [
      { text: 'Dastlabki tajriba talab qilinmaydi', kind: 'knowledge' },
      { text: 'Figma o‘rnatilgan kompyuter', kind: 'equipment' },
    ],
    curriculum: [
      {
        title: 'Kirish: UX nima?',
        lessons: 3,
        duration: '1 soat',
        topics: ['UX va UI farqi', 'Jarayon', 'Vositalar'],
      },
      {
        title: 'Foydalanuvchi tadqiqoti',
        lessons: 4,
        duration: '1 soat 40 daqiqa',
        topics: ['Intervyu', 'Personalar', 'Foydalanuvchi yo\'li', 'Amaliyot'],
      },
      {
        title: 'Figma va prototiplar',
        lessons: 5,
        duration: '2 soat 20 daqiqa',
        topics: ['Auto layout', 'Komponentlar', 'Variantlar', 'Prototip', 'Amaliyot'],
      },
      {
        title: 'Dizayn tizimi va portfolio',
        lessons: 4,
        duration: '2 soat',
        topics: ['Tokenlar', 'Kutubxona', 'Hujjatlashtirish', 'Himoya'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Aziza Normatova',
        rating: 5,
        date: '2026-06-10',
        text: "Noldan boshladim va oxirida portfolio bilan chiqdim. Tadqiqot moduli eng kuchlisi.",
      },
      {
        id: 'r2',
        author: 'Bekzod Qodirov',
        rating: 5,
        date: '2026-01-25',
        text: 'Dizayn tizimi qismi ishimni butunlay o‘zgartirdi.',
      },
    ],
    topics: ['Tadqiqot', 'Figma', 'Dizayn tizimi', 'Portfolio'],
  },
]

/** Chip order for the catalogue filter, derived so new courses show up on their own. */
export const courseCategories = Array.from(new Set(courses.map((course) => course.category)))

/** Single source of truth for the lesson count — the curriculum itself. */
export function lessonCount(course: Course) {
  return course.curriculum.reduce((total, module) => total + module.lessons, 0)
}

/** Mean review score, rounded to one decimal. Zero when nobody has reviewed yet. */
export function averageRating(course: Course) {
  if (course.reviews.length === 0) return 0
  const sum = course.reviews.reduce((total, review) => total + review.rating, 0)
  return Math.round((sum / course.reviews.length) * 10) / 10
}
