"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, Download, Eye, Undo2, Redo2, Pipette, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportDialog } from "./export-dialog"
import { carColorPalettes } from "@/lib/color-palettes"
import type { Project } from "./project-manager"

interface ColorEditorProps {
  project: Project | null
  onSave: (project: Project) => void
  onBack: () => void
}

type BlendMode = GlobalCompositeOperation

export function ColorEditor({ project, onSave, onBack }: ColorEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentColor, setCurrentColor] = useState("#FF6B35")
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)
  const [colors, setColors] = useState<Record<string, string>>({})
  const [savedMessage, setSavedMessage] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)
  const [eyedropperMode, setEyedropperMode] = useState(false)
  const [blendMode, setBlendMode] = useState<BlendMode>("color")
  const [opacity, setOpacity] = useState(0.6)

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
        saveToHistory()
      }
      img.src = project.image
    }
  }, [project?.image])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault()
          undo()
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault()
          redo()
        } else if (e.key === "s") {
          e.preventDefault()
          saveProject()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [historyStep, history, project])

  // Helper to get coordinates from mouse or touch events
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    
    let clientX, clientY

    // Check if it's a touch event
    if ('touches' in e) {
       // Preventing default here might be too aggressive for all touch events, 
       // but for painting we usually want to stop scrolling.
       // We'll handle preventDefault in the event handlers instead.
       if (e.touches.length > 0) {
           clientX = e.touches[0].clientX
           clientY = e.touches[0].clientY
       } else {
           return null
       }
    } else {
       // Mouse event
       clientX = (e as React.MouseEvent).clientX
       clientY = (e as React.MouseEvent).clientY
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    }
  }

  const paint = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e)
    if (!coords || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.save()
    ctx.globalCompositeOperation = blendMode
    ctx.fillStyle = currentColor
    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(coords.x, coords.y, brushSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if(!eyedropperMode) setIsDrawing(true)
      if (eyedropperMode) handleEyedropper(e)
      else paint(e)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing && !eyedropperMode) return
      if (eyedropperMode) return // Optional preview for eyedropper?
      paint(e)
  }

  const handleMouseUp = () => {
      setIsDrawing(false)
      if (!eyedropperMode) saveToHistory()
  }

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
      // e.preventDefault() // Often necessary to prevent scrolling, but add passive:false logic if strictly needed
      // React synthetic events already wrap this.
      if(!eyedropperMode) setIsDrawing(true)
      if (eyedropperMode) handleEyedropper(e) 
      else paint(e)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
      // Prevent scrolling while painting
      // Note: In React 18+ strict mode, this might warn if not passive, but for canvas drawing it's standard 
      // to stop scroll. 
      // However, sometimes better to handle it with CSS touch-action: none
      if (!isDrawing && !eyedropperMode) return
      paint(e)
  }

  const handleTouchEnd = () => {
      setIsDrawing(false)
      if (!eyedropperMode) saveToHistory()
  }

  // Eyedropper needs to handle touch too if we want it mobile compatible
  const handleEyedropper = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!eyedropperMode || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const coords = getCoordinates(e)
    if(!coords) return

    const pixel = ctx.getImageData(coords.x, coords.y, 1, 1).data
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`
    setCurrentColor(hex)
    setEyedropperMode(false)
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
        <div className="flex-1 flex items-center justify-center bg-muted rounded-lg overflow-hidden min-h-96 relative">
          <canvas
            ref={canvasRef}
            
            // Mouse Events
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}

            // Touch Events
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}

            className={`max-w-full max-h-full object-contain touch-none ${
              eyedropperMode ? "cursor-crosshair" : "cursor-crosshair"
            }`}
             style={{ touchAction: 'none' }} // Critical for preventing scroll on mobile
          />

        </div>

        {/* Control Panel */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          
          {/* Blend Options */}
          <Card className="bg-card border border-border p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4"/>
                Opciones de Mezcla
            </h3>
            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Modo de Fusión</label>
                    <Select value={blendMode} onValueChange={(v) => setBlendMode(v as BlendMode)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona modo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="color">Color (Realista)</SelectItem>
                            <SelectItem value="overlay">Superponer (Contraste)</SelectItem>
                            <SelectItem value="multiply">Multiplicar (Oscurecer)</SelectItem>
                            <SelectItem value="source-over">Normal (Plano)</SelectItem>
                            <SelectItem value="screen">Pantalla (Aclarar)</SelectItem>
                            <SelectItem value="hue">Solo Matiz</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                     <div className="flex justify-between">
                        <label className="text-xs text-muted-foreground">Opacidad</label>
                        <span className="text-xs text-muted-foreground">{Math.round(opacity * 100)}%</span>
                     </div>
                     <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                </div>
            </div>
          </Card>

          {/* Color Picker */}
          <Card className="bg-card border border-border p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Color Actual</h3>
            <div className="flex gap-3 items-center mb-3">
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
            <Button
              onClick={() => setEyedropperMode(!eyedropperMode)}
              variant={eyedropperMode ? "default" : "outline"}
              size="sm"
              className="w-full"
            >
              <Pipette className="w-4 h-4 mr-2" />
              {eyedropperMode ? "Modo Selector Activo" : "Selector de Color"}
            </Button>
          </Card>

          {/* Color Palettes */}
          <Card className="bg-card border border-border p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Paletas de Colores</h3>
            <Tabs defaultValue="classic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-3">
                <TabsTrigger value="classic" className="text-xs">Clásicos</TabsTrigger>
                <TabsTrigger value="metallic" className="text-xs">Metálicos</TabsTrigger>
                <TabsTrigger value="vibrant" className="text-xs">Vibrantes</TabsTrigger>
              </TabsList>
              {Object.entries(carColorPalettes).slice(0, 3).map(([key, palette]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  <div className="grid grid-cols-5 gap-2">
                    {palette.colors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setCurrentColor(color.hex)}
                        className="w-full aspect-square rounded-md border-2 border-border hover:border-primary transition-colors"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
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

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                onClick={undo}
                disabled={historyStep <= 0}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                title="Deshacer (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                title="Rehacer (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>
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
              Resetear Imagen
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
