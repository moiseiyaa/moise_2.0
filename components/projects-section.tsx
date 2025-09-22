"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function ProjectsSection() {
  const router = useRouter()

  const projects = [
    {
      title: "E-Commerce Platform",
      category: "Web Development",
      image: "/quantum-computing-interface-dark-theme.jpg",
      color: "from-primary/20 to-primary/5",
    },
    {
      title: "Mobile Banking App",
      category: "Mobile Development",
      image: "/futuristic-neural-network.png",
      color: "from-secondary/20 to-secondary/5",
    },
    {
      title: "AI Dashboard",
      category: "UI/UX Design",
      image: "/quantum-computing-interface-dark-theme.jpg",
      color: "from-accent/20 to-accent/5",
    },
  ]

  const handleViewAllProjects = () => {
    router.push("/projects")
  }

  const handleProjectClick = (projectTitle: string) => {
    // Navigate to projects page with focus on specific project
    router.push(`/projects#${projectTitle.toLowerCase().replace(/\s+/g, "-")}`)
  }

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Recent <span className="text-primary">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing my latest work in web development, mobile apps, and digital innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => handleProjectClick(project.title)}>
              <div className="glass-effect rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                <div className={`h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <ExternalLink className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-primary mb-2">{project.category}</div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="bg-transparent" onClick={handleViewAllProjects}>
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
