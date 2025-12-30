"use client"

import { useState, useEffect } from "react"
import { ProjectManager, type Project } from "@/components/project-manager"
import { CameraCapture } from "@/components/camera-capture"
import { ColorEditor } from "@/components/color-editor"

type AppState = "projects" | "camera" | "editor"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("projects")
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const saved = localStorage.getItem("carColorProjects")
      if (saved) {
        try {
          setProjects(JSON.parse(saved))
        } catch (e) {
          console.error("Error loading projects:", e)
        }
      }
    }
  }, [mounted])

  const handleNewProject = () => {
    setAppState("camera")
  }

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project)
    setAppState("editor")
  }

  const handleCameraCapture = (image: string) => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name: `Proyecto ${new Date().toLocaleDateString("es-ES")}`,
      image,
      colors: {},
      timestamp: Date.now(),
    }
    setCurrentProject(newProject)
    setProjects([newProject, ...projects])
    localStorage.setItem("carColorProjects", JSON.stringify([newProject, ...projects]))
    setAppState("editor")
  }

  const handleCameraCancel = () => {
    setAppState("projects")
  }

  const handleSaveProject = (updatedProject: Project) => {
    const updated = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    setProjects(updated)
    setCurrentProject(updatedProject)
    localStorage.setItem("carColorProjects", JSON.stringify(updated))
  }

  const handleBackToProjects = () => {
    setAppState("projects")
    setCurrentProject(null)
  }

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <>
      {appState === "projects" && (
        <ProjectManager onSelectProject={handleSelectProject} onNewProject={handleNewProject} />
      )}
      {appState === "camera" && <CameraCapture onCapture={handleCameraCapture} onCancel={handleCameraCancel} />}
      {appState === "editor" && (
        <ColorEditor project={currentProject} onSave={handleSaveProject} onBack={handleBackToProjects} />
      )}
    </>
  )
}
