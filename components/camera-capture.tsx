"use client"

import { useEffect, useState } from "react"
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { Loader2 } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (image: string) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [opening, setOpening] = useState(true)

  useEffect(() => {
    takePicture()
  }, [])

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, 
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      })

      if (image.dataUrl) {
        onCapture(image.dataUrl)
      } else {
        onCancel()
      }
    } catch (e) {
      console.log('User cancelled or error', e)
      onCancel()
    } finally {
      setOpening(false)
    }
  }

  if (opening) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-foreground">Abriendo cámara...</p>
      </div>
    )
  }

  return null
}
