import { Header } from './Header'
import { Hero } from './Hero'
import { ProcessSection } from './ProcessSection'
import { StatsSection } from './StatsSection'
import { MentorsSection } from './MentorsSection'
import { Footer } from './Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header />
      <Hero />
      <ProcessSection />
      <StatsSection />
      <MentorsSection />
      <Footer />
    </div>
  )
}
