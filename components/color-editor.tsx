"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ExportDialog } from "./export-dialog"
import type { Project } from "./project-manager"

interface ColorEditorProps {
  project: Project | null
  onSave: (project: Project) => void
  onBack: () => void
}

export function ColorEditor({ project, onSave, onBack }: ColorEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentColor, setCurrentColor] = useState("#FF6B35")
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)
  const [colors, setColors] = useState<Record<string, string>>({})
  const [savedMessage, setSavedMessage] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  useEffect(() => {
    if (project?.colors) {
      setColors(project.colors)
    }
  }, [project])

  useEffect(() => {
    if (canvasRef.current && project?.image) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      }
      img.src = project.image
    }
  }, [project?.image])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    const areaId = `area_${Date.now()}`
    setColors((prev) => ({ ...prev, [areaId]: currentColor }))
  }

  const handlePaint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    ctx.fillStyle = currentColor
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.arc(x, y, brushSize, 0, Math.PI * 2)
    ctx.fill()
  }

  const saveProject = () => {
    if (project) {
      const updated = { ...project, colors }
      onSave(updated)
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 2000)
    }
  }

  const undoLastChange = () => {
    if (canvasRef.current && project?.image) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      }
      img.src = project.image
    }
  }

  if (!project) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-foreground">{project.name}</h1>
              <p className="text-xs text-muted-foreground">Editor de colores</p>
            </div>
          </div>
          {savedMessage && <span className="text-xs text-green-500">✓ Guardado</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-muted rounded-lg overflow-hidden min-h-96">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseMove={handlePaint}
            onMouseLeave={() => setIsDrawing(false)}
            className="max-w-full max-h-full object-contain cursor-crosshair"
          />
        </div>

        {/* Control Panel */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          {/* Color Picker */}
          <Card className="bg-card border border-border p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Color Actual</h3>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-16 h-16 rounded-lg cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-2">Valor</p>
                <Input
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="bg-input border-border text-xs"
                />
              </div>
            </div>
          </Card>

          {/* Brush Settings */}
          <Card className="bg-card border border-border p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Tamaño del Pincel</h3>
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">{brushSize}px</p>
          </Card>

          {/* Instructions */}
          <Card className="bg-card border border-border p-4">
            <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Cómo usar
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Selecciona un color con el picker</li>
              <li>• Haz clic o arrastra para pintar</li>
              <li>• Ajusta el tamaño según necesites</li>
              <li>• Guarda tu proyecto</li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={saveProject}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Guardar Proyecto
            </Button>
            <Button onClick={() => setExportOpen(true)} variant="outline" className="w-full bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={undoLastChange} variant="outline" className="w-full bg-transparent">
              Deshacer
            </Button>
          </div>
        </div>
      </div>

      <ExportDialog
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        projectName={project.name}
        canvasRef={canvasRef}
      />
    </div>
  )
}
