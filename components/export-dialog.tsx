"use client"

import type React from "react"

import { useState } from "react"
import { X, Share2, Download, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function ExportDialog({ isOpen, onClose, projectName, canvasRef }: ExportDialogProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const exportAsJSON = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const data = {
        name: projectName,
        image: canvas.toDataURL("image/png"),
        timestamp: new Date().toISOString(),
      }
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${projectName}-colorwheel.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const exportAsImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.href = canvasRef.current.toDataURL("image/png")
      link.download = `${projectName}-auto-customizado.png`
      link.click()
    }
  }

  const copyImageToClipboard = async () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          navigator.clipboard
            .write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ])
            .then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            })
        }
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="bg-card border border-border max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Exportar Proyecto</h2>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <Button onClick={exportAsImage} className="w-full bg-primary hover:bg-primary/90" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Descargar Imagen (PNG)
            </Button>

            <Button onClick={exportAsJSON} variant="outline" className="w-full bg-transparent" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Descargar Proyecto (JSON)
            </Button>

            <Button onClick={copyImageToClipboard} variant="outline" className="w-full bg-transparent" size="lg">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copiado al portapapeles
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Imagen
                </>
              )}
            </Button>

            <div className="bg-muted p-4 rounded-lg mt-4">
              <p className="text-xs text-muted-foreground mb-2">
                <Share2 className="w-4 h-4 inline mr-2" />
                Para compartir en redes sociales:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>1. Copia la imagen al portapapeles</li>
                <li>2. Abre Instagram, Twitter, Facebook, etc.</li>
                <li>3. Pega la imagen en un nuevo post</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
