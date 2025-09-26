import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ClientSection } from "@/components/client-section"
import { BusinessSection } from "@/components/business-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <ClientSection />
      <BusinessSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  )
}
