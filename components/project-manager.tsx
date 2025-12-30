"use client"

import { useState, useEffect } from "react"
import { Plus, Folder, Trash2, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConfirmDialog } from "@/components/confirm-dialog"

export interface Project {
  id: string
  name: string
  image: string
  colors: Record<string, string>
  timestamp: number
}

interface ProjectManagerProps {
  onSelectProject: (project: Project) => void
  onNewProject: () => void
}

export function ProjectManager({ onSelectProject, onNewProject }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; projectId: string | null }>({
    open: false,
    projectId: null,
  })

  useEffect(() => {
    const saved = localStorage.getItem("carColorProjects")
    if (saved) {
      try {
        setProjects(JSON.parse(saved))
      } catch (e) {
        console.error("Error loading projects:", e)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("carColorProjects", JSON.stringify(projects))
    }
  }, [projects, loading])

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
    setDeleteConfirm({ open: false, projectId: null })
  }

  const duplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `project_${Date.now()}`,
      name: `${project.name} (Copia)`,
      timestamp: Date.now(),
    }
    setProjects([duplicated, ...projects])
  }

  const renameProject = (id: string, newName: string) => {
    if (newName.trim()) {
      setProjects(projects.map((p) => (p.id === id ? { ...p, name: newName } : p)))
      setNewName("")
    }
  }

  const exportProject = (project: Project) => {
    const dataStr = JSON.stringify(project, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${project.name}-colorwheel.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Cargando proyectos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">ColorWheel</h1>
                <p className="text-sm text-muted-foreground">Personaliza los colores de tu auto</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* New Project Button */}
        <Button
          onClick={onNewProject}
          className="w-full md:w-auto mb-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Proyecto
        </Button>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="bg-card border border-border p-8 text-center">
            <Folder className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-4">No hay proyectos aún</p>
            <p className="text-sm text-muted-foreground">Crea tu primer proyecto para comenzar</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="bg-card border border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => onSelectProject(project)}
              >
                {/* Project Image */}
                <div className="relative w-full h-40 bg-muted overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{project.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(project.timestamp).toLocaleDateString("es-ES")}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateProject(project)
                      }}
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                      title="Duplicar proyecto"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        exportProject(project)
                      }}
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                      title="Descargar proyecto"
                    >
                      <Download className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm({ open: true, projectId: project.id })
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, projectId: null })}
        onConfirm={() => deleteConfirm.projectId && deleteProject(deleteConfirm.projectId)}
        title="¿Eliminar proyecto?"
        description="Esta acción no se puede deshacer. El proyecto será eliminado permanentemente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}
