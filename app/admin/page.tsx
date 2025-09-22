"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Eye, BarChart3, Users, FileText, Save, X, LogOut, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  published: boolean
  image_url?: string
  technologies: string[]
  github_url?: string
  demo_url?: string
  created_at: string
  user_id: string
}

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  published: boolean
  image_url?: string
  slug: string
  created_at: string
  user_id: string
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
      await loadData()
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  const loadData = async () => {
    try {
      const [projectsResponse, blogPostsResponse] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      ])

      if (projectsResponse.data) setProjects(projectsResponse.data)
      if (blogPostsResponse.data) setBlogPosts(blogPostsResponse.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `images/${fileName}`

      const { error: uploadError } = await supabase.storage.from("portfolio-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("portfolio-images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Using local preview.",
        variant: "destructive",
      })
      // Fallback to local preview
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
    }
  }

  const handleCreateProject = async (formData: FormData) => {
    if (!user) return

    try {
      const imageFile = formData.get("imageFile") as File
      let imageUrl = formData.get("image") as string

      if (imageFile && imageFile.size > 0) {
        imageUrl = await handleImageUpload(imageFile)
      }

      const projectData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        published: formData.get("status") === "published",
        image_url: imageUrl || null,
        technologies: (formData.get("technologies") as string).split(",").map((t) => t.trim()),
        github_url: (formData.get("githubUrl") as string) || null,
        demo_url: (formData.get("liveUrl") as string) || null,
        user_id: user.id,
      }

      const { data, error } = await supabase.from("projects").insert([projectData]).select().single()

      if (error) throw error

      setProjects([data, ...projects])
      setIsProjectDialogOpen(false)
      toast({
        title: "Project Created",
        description: "Your project has been successfully created.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProject = async (formData: FormData) => {
    if (!editingProject || !user) return

    try {
      const imageFile = formData.get("imageFile") as File
      let imageUrl = formData.get("image") as string

      if (imageFile && imageFile.size > 0) {
        imageUrl = await handleImageUpload(imageFile)
      }

      const projectData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        published: formData.get("status") === "published",
        image_url: imageUrl || editingProject.image_url,
        technologies: (formData.get("technologies") as string).split(",").map((t) => t.trim()),
        github_url: (formData.get("githubUrl") as string) || null,
        demo_url: (formData.get("liveUrl") as string) || null,
      }

      const { data, error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingProject.id)
        .select()
        .single()

      if (error) throw error

      setProjects(projects.map((p) => (p.id === editingProject.id ? data : p)))
      setEditingProject(null)
      setIsProjectDialogOpen(false)
      toast({
        title: "Project Updated",
        description: "Your project has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error

      setProjects(projects.filter((p) => p.id !== id))
      toast({
        title: "Project Deleted",
        description: "The project has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const handleCreateBlogPost = async (formData: FormData) => {
    if (!user) return

    try {
      const imageFile = formData.get("imageFile") as File
      let imageUrl = formData.get("image") as string

      if (imageFile && imageFile.size > 0) {
        imageUrl = await handleImageUpload(imageFile)
      }

      const title = formData.get("title") as string
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const blogPostData = {
        title,
        content: formData.get("content") as string,
        excerpt: formData.get("excerpt") as string,
        published: formData.get("status") === "published",
        image_url: imageUrl || null,
        slug,
        user_id: user.id,
      }

      const { data, error } = await supabase.from("blog_posts").insert([blogPostData]).select().single()

      if (error) throw error

      setBlogPosts([data, ...blogPosts])
      setIsBlogDialogOpen(false)
      toast({
        title: "Blog Post Created",
        description: "Your blog post has been successfully created.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBlogPost = async (formData: FormData) => {
    if (!editingBlogPost || !user) return

    try {
      const imageFile = formData.get("imageFile") as File
      let imageUrl = formData.get("image") as string

      if (imageFile && imageFile.size > 0) {
        imageUrl = await handleImageUpload(imageFile)
      }

      const title = formData.get("title") as string
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const blogPostData = {
        title,
        content: formData.get("content") as string,
        excerpt: formData.get("excerpt") as string,
        published: formData.get("status") === "published",
        image_url: imageUrl || editingBlogPost.image_url,
        slug,
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .update(blogPostData)
        .eq("id", editingBlogPost.id)
        .select()
        .single()

      if (error) throw error

      setBlogPosts(blogPosts.map((p) => (p.id === editingBlogPost.id ? data : p)))
      setEditingBlogPost(null)
      setIsBlogDialogOpen(false)
      toast({
        title: "Blog Post Updated",
        description: "Your blog post has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBlogPost = async (id: string) => {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) throw error

      setBlogPosts(blogPosts.filter((p) => p.id !== id))
      toast({
        title: "Blog Post Deleted",
        description: "The blog post has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    }
  }

  const handleProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (editingProject) {
      handleUpdateProject(formData)
    } else {
      handleCreateProject(formData)
    }
  }

  const handleBlogSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (editingBlogPost) {
      handleUpdateBlogPost(formData)
    } else {
      handleCreateBlogPost(formData)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Admin <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-muted-foreground">Manage your portfolio content and analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  View Site
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold text-primary">{projects.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blog Posts</p>
                    <p className="text-2xl font-bold text-accent">{blogPosts.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold text-secondary">
                      {projects.filter((p) => p.published).length + blogPosts.filter((p) => p.published).length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Drafts</p>
                    <p className="text-2xl font-bold text-foreground">
                      {projects.filter((p) => !p.published).length + blogPosts.filter((p) => !p.published).length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Management Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="glass-effect">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Manage Projects</h2>
                <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setEditingProject(null)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
                      <DialogDescription>
                        {editingProject
                          ? "Update your project details below."
                          : "Fill in the details to create a new project."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={editingProject?.title || ""}
                          required
                          className="bg-muted border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          defaultValue={editingProject?.description || ""}
                          required
                          className="bg-muted border-border"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="imageFile">Upload Image</Label>
                        <Input
                          id="imageFile"
                          name="imageFile"
                          type="file"
                          accept="image/*"
                          className="bg-muted border-border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Or provide an image URL below</p>
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL (optional)</Label>
                        <Input
                          id="image"
                          name="image"
                          defaultValue={editingProject?.image_url || ""}
                          className="bg-muted border-border"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                        <Input
                          id="technologies"
                          name="technologies"
                          defaultValue={editingProject?.technologies.join(", ") || ""}
                          required
                          className="bg-muted border-border"
                          placeholder="React, TypeScript, Next.js"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="githubUrl">GitHub URL</Label>
                          <Input
                            id="githubUrl"
                            name="githubUrl"
                            defaultValue={editingProject?.github_url || ""}
                            className="bg-muted border-border"
                            placeholder="https://github.com/username/repo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="liveUrl">Live URL</Label>
                          <Input
                            id="liveUrl"
                            name="liveUrl"
                            defaultValue={editingProject?.demo_url || ""}
                            className="bg-muted border-border"
                            placeholder="https://project.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingProject?.published ? "published" : "draft"}>
                          <SelectTrigger className="bg-muted border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsProjectDialogOpen(false)
                            setEditingProject(null)
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <Save className="h-4 w-4 mr-2" />
                          {editingProject ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {projects.length === 0 ? (
                <Card className="glass-effect border-border">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first project to get started</p>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setIsProjectDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="glass-effect border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground">{project.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={project.published ? "default" : "secondary"}>
                                  {project.published ? "published" : "draft"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(project.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              onClick={() => {
                                setEditingProject(project)
                                setIsProjectDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Manage Blog Posts</h2>
                <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setEditingBlogPost(null)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingBlogPost ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
                      <DialogDescription>
                        {editingBlogPost
                          ? "Update your blog post details below."
                          : "Fill in the details to create a new blog post."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="blog-title">Title</Label>
                        <Input
                          id="blog-title"
                          name="title"
                          defaultValue={editingBlogPost?.title || ""}
                          required
                          className="bg-muted border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          name="excerpt"
                          defaultValue={editingBlogPost?.excerpt || ""}
                          required
                          className="bg-muted border-border"
                          rows={2}
                          placeholder="A brief description of your blog post..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          name="content"
                          defaultValue={editingBlogPost?.content || ""}
                          required
                          className="bg-muted border-border"
                          rows={8}
                          placeholder="Write your blog post content here..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="blogImageFile">Upload Image</Label>
                        <Input
                          id="blogImageFile"
                          name="imageFile"
                          type="file"
                          accept="image/*"
                          className="bg-muted border-border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Or provide an image URL below</p>
                      </div>
                      <div>
                        <Label htmlFor="blog-image">Image URL (optional)</Label>
                        <Input
                          id="blog-image"
                          name="image"
                          defaultValue={editingBlogPost?.image_url || ""}
                          className="bg-muted border-border"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="blog-status">Status</Label>
                        <Select name="status" defaultValue={editingBlogPost?.published ? "published" : "draft"}>
                          <SelectTrigger className="bg-muted border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsBlogDialogOpen(false)
                            setEditingBlogPost(null)
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <Save className="h-4 w-4 mr-2" />
                          {editingBlogPost ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {blogPosts.length === 0 ? (
                <Card className="glass-effect border-border">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Share your thoughts and expertise with your first blog post
                    </p>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setIsBlogDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Write Your First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {blogPosts.map((post) => (
                    <Card key={post.id} className="glass-effect border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground">{post.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={post.published ? "default" : "secondary"}>
                                  {post.published ? "published" : "draft"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(post.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              onClick={() => {
                                setEditingBlogPost(post)
                                setIsBlogDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                              onClick={() => handleDeleteBlogPost(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-semibold">Analytics Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-effect border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Content Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Projects</span>
                        <span className="font-semibold">{projects.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Published Projects</span>
                        <span className="font-semibold">{projects.filter((p) => p.published).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Blog Posts</span>
                        <span className="font-semibold">{blogPosts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Published Posts</span>
                        <span className="font-semibold">{blogPosts.filter((p) => p.published).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-accent" />
                      Content Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Draft Projects</span>
                        <span className="font-semibold">{projects.filter((p) => !p.published).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Draft Posts</span>
                        <span className="font-semibold">{blogPosts.filter((p) => !p.published).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Content</span>
                        <span className="font-semibold">{projects.length + blogPosts.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-semibold">Settings</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-effect border-border">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input value={user?.email || ""} disabled className="bg-muted border-border" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Display Name</label>
                      <Input defaultValue="Moise 2.0" className="bg-muted border-border" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Bio</label>
                      <Textarea
                        defaultValue="Crafting the future through innovative code and design"
                        className="bg-muted border-border"
                        rows={3}
                      />
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                  </CardContent>
                </Card>
                <Card className="glass-effect border-border">
                  <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                    <CardDescription>Configure your portfolio settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Site Title</label>
                      <Input defaultValue="Moise 2.0 - Futuristic Portfolio" className="bg-muted border-border" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Contact Email</label>
                      <Input defaultValue="hello@moise2.dev" className="bg-muted border-border" />
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Update Settings</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
