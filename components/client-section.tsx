import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import Image from "next/image"

export function ClientSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Clients Get Always <br />
                <span className="text-primary">Exceptional Works</span> <br />
                From Me
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                I deliver high-quality solutions that exceed expectations and drive business growth through innovative
                technology
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>High Quality Work</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Clean Communication</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Fast Turnaround</span>
              </div>
            </div>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right Content - Profile with Testimonials */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/moise-profile.jpg"
                alt="Moise Dev"
                width={400}
                height={500}
                className="rounded-2xl mx-auto"
              />
            </div>

            {/* Floating Testimonial Cards */}
            <div className="absolute -top-4 -left-8 glass-effect p-4 rounded-xl max-w-xs float-delay-1">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-2">"Outstanding work quality and professional communication!"</p>
              <div className="text-xs text-muted-foreground">- Sarah Johnson, CEO</div>
            </div>

            <div className="absolute -bottom-8 -right-4 glass-effect p-4 rounded-xl max-w-xs float-delay-2">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-2">"Delivered exactly what we needed, on time and on budget."</p>
              <div className="text-xs text-muted-foreground">- Mike Chen, CTO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
