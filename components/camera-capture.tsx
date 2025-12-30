"use client"

import { useRef, useState } from "react"
import { Camera, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onCapture: (image: string) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [capturing, setCapturing] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCapturing(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("No se pudo acceder a la cámara")
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg", 0.9)
        setPhoto(imageData)
      }
    }
  }

  const retake = () => {
    setPhoto(null)
  }

  const confirm = () => {
    if (photo) {
      onCapture(photo)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCapturing(false)
    }
  }

  if (photo) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <img src={photo || "/placeholder.svg"} alt="Captured" className="max-w-full max-h-full object-contain" />
        </div>
        <div className="p-4 flex gap-3 justify-center bg-card border-t border-border">
          <Button variant="outline" onClick={retake} className="flex-1 md:flex-none bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retomar
          </Button>
          <Button onClick={confirm} className="flex-1 md:flex-none bg-primary hover:bg-primary/90">
            <Check className="w-4 h-4 mr-2" />
            Confirmar
          </Button>
        </div>
      </div>
    )
  }

  if (capturing) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3 justify-center bg-gradient-to-t from-background to-transparent">
          <Button variant="outline" onClick={stopCamera}>
            Cancelar
          </Button>
          <Button onClick={takePhoto} className="bg-primary hover:bg-primary/90 rounded-full p-0 w-16 h-16">
            <Camera className="w-8 h-8" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4">
      <canvas ref={canvasRef} className="hidden" />
      <div className="text-center mb-6">
        <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Captura tu auto</h2>
        <p className="text-muted-foreground">Toma una foto clara desde un ángulo frontal</p>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <Button variant="outline" onClick={onCancel} className="flex-1 md:flex-none bg-transparent">
          Atrás
        </Button>
        <Button onClick={startCamera} className="flex-1 md:flex-none bg-primary hover:bg-primary/90">
          <Camera className="w-4 h-4 mr-2" />
          Abrir Cámara
        </Button>
      </div>
    </div>
  )
}
