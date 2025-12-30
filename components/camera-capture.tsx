"use client"

import { useState } from "react"
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { Loader2, Image, Camera as CameraIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraCaptureProps {
  onCapture: (image: string) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [opening, setOpening] = useState(false)

  const getPhoto = async (source: CameraSource) => {
    setOpening(true)
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, 
        resultType: CameraResultType.DataUrl,
        source: source
      })

      if (image.dataUrl) {
        onCapture(image.dataUrl)
      } else {
        setOpening(false)
      }
    } catch (e) {
      console.log('User cancelled or error', e)
      setOpening(false)
    }
  }

  if (opening) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-foreground">Procesando imagen...</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-6 bg-card rounded-xl border shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Seleccionar Imagen</h2>
          <p className="text-muted-foreground">Elige cómo quieres capturar tu auto</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="h-32 flex flex-col gap-3 text-lg font-medium" 
            variant="outline"
            onClick={() => getPhoto(CameraSource.Camera)}
          >
            <CameraIcon className="w-8 h-8 text-primary" />
            Cámara
          </Button>

          <Button 
            className="h-32 flex flex-col gap-3 text-lg font-medium" 
            variant="outline"
            onClick={() => getPhoto(CameraSource.Photos)}
          >
            <Image className="w-8 h-8 text-secondary-foreground" />
            Galería
          </Button>
        </div>

        <Button 
          variant="ghost" 
          className="w-full"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}
