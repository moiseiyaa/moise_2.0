"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Users, Award, Download } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/contact")
  }

  const handleDownloadCV = () => {
    // Create a dummy CV download
    const link = document.createElement("a")
    link.href = "/professional-cv-document.jpg"
    link.download = "Moise_Dev_CV.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="float">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
                Hi! I Am <br />
                <span className="text-primary">Moise Dev</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg text-pretty">
                Crafting the future through innovative code, cutting-edge design, and revolutionary digital experiences
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" onClick={handleDownloadCV}>
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </div>

            {/* Social Stats */}
            <div className="flex gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">100+</div>
                <div className="text-sm text-muted-foreground">Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">5+</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Image with Floating Cards */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/moise-profile.jpg"
                alt="Moise Dev"
                width={500}
                height={600}
                className="rounded-2xl mx-auto"
              />
            </div>

            {/* Floating UI Cards */}
            <div className="absolute -top-4 -left-4 glass-effect p-4 rounded-xl float-delay-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Top Rated</div>
                  <div className="text-xs text-muted-foreground">Developer</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 glass-effect p-4 rounded-xl float-delay-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">100+ Clients</div>
                  <div className="text-xs text-muted-foreground">Worldwide</div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 glass-effect p-3 rounded-xl float-delay-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold">Award Winner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
