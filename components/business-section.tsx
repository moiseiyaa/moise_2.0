import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Users, Award } from "lucide-react"

export function BusinessSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Graphics/Stats */}
          <div className="relative">
            <div className="glass-effect p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">250+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-secondary">150+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-accent">15+</div>
                  <div className="text-sm text-muted-foreground">Awards Won</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Perfect Solution <br />
                <span className="text-primary">For Your Business</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Transform your business with cutting-edge technology solutions that drive growth, efficiency, and
                innovation in the digital landscape
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Scalable Architecture</h4>
                  <p className="text-muted-foreground">Built to grow with your business needs</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">24/7 Support</h4>
                  <p className="text-muted-foreground">Round-the-clock technical assistance</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Security First</h4>
                  <p className="text-muted-foreground">Enterprise-grade security measures</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
