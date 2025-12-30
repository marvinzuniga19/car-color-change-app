"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(userAgent))

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(() => console.log("SW registered"))
        .catch(() => console.log("SW registration failed"))
    }
  }, [])

  if (!showPrompt && !isIOS) return null

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg max-w-xs z-50 animate-in slide-in-from-bottom-4">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 p-1 hover:bg-primary-foreground/20 rounded"
      >
        <X className="w-4 h-4" />
      </button>

      {isIOS && !showPrompt ? (
        <div>
          <p className="text-sm font-semibold mb-2">Instalar ColorWheel</p>
          <p className="text-xs mb-3 pr-6">Toca el botón de compartir y selecciona "Agregar a Pantalla de Inicio"</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold mb-3">Instalar ColorWheel</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-1 px-3 py-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded text-sm"
            >
              Después
            </button>
            <button
              onClick={() => {
                deferredPrompt?.prompt()
                setShowPrompt(false)
              }}
              className="flex-1 px-3 py-2 bg-primary-foreground text-primary rounded text-sm font-semibold"
            >
              Instalar
            </button>
          </div>
        </>
      )}
    </div>
  )
}
