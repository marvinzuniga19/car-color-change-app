# 🎨 ColorWheel - Auto Customizer

Una aplicación web progresiva (PWA) y móvil que permite personalizar los colores de tu auto mediante realidad aumentada.

![ColorWheel](public/apple-icon.png)

## ✨ Características

- 📸 **Cámara y Galería** - Integración nativa para tomar fotos o elegir desde la galería
- 🎨 **Editor Profesional** - Modos de fusión (Color, Overlay, Multiply) para resultados realistas
- �️ **Herramientas de Precisión** - Pincel ajustable, control de opacidad y deshacer/rehacer
- � **Gestión de Proyectos** - Guarda tu progreso localmente
- 📱 **Android Nativo** - Optimizado para rendimiento móvil con Capacitor
- 🌙 **Tema Oscuro** - Interfaz moderna diseñada para trabajar con fotos

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- Android Studio (para generar APK)

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd car-color-change-app

# Instalar dependencias
npm install
```

### Build y Ejecución en Android

```bash
# 1. Build de Next.js
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Abrir en Android Studio
npx cap open android
# O generar APK directamente:
# cd android && ./gradlew assembleDebug
```

## 🛠️ Stack Tecnológico

- **Core**: Next.js 16 (React 19) + TypeScript
- **Estilos**: Tailwind CSS v4 + Radix UI
- **Mobile Native**: Capacitor 8 + Plugins (@capacitor/camera, @capacitor/filesystem)
- **Gráficos**: Canvas API con Blending Modes

## 📁 Estructura del Proyecto

```
car-color-change-app/
├── app/                    # Next.js App Router
├── components/            # Componentes React
│   ├── camera-capture.tsx # Lógica nativa de cámara/galería
│   ├── color-editor.tsx   # Canvas con modos de mezcla
│   └── ...
├── android/              # Proyecto nativo Android
└── capacitor.config.ts   # Configuración de plugins
```

## 🎯 Uso

### 1. Iniciar Proyecto

1. Toca "Nuevo Proyecto"
2. Elige: **📷 Cámara** para tomar una foto o **🖼️ Galería** para seleccionar una existente
3. Confirma la imagen

### 2. Personalizar Color

1. **Elige un color**: Usa el picker o las paletas predefinidas (Clásicos, Metálicos, etc.)
2. **Modo de Fusión**: En "Opciones de Mezcla", selecciona:
   - **Color**: Ideal para cambiar el tono manteniendo la textura (Defecto)
   - **Overlay**: Mejor contraste para autos claros/grises
   - **Multiply**: Para oscurecer colores
3. **Opacidad**: Ajusta la intensidad del efecto
4. **Pinta**: Desliza el dedo sobre el área del auto

### 3. Guardar y Compartir

- Botón "Guardar Proyecto" para almacenar en el dispositivo
- Botón "Exportar" para guardar la imagen final

## � Permisos Requeridos (Android)

La aplicación solicitará los siguientes permisos en tiempo de ejecución:

- **Cámara**: Para tomar fotos
- **Archivos/Galería**: Para seleccionar y guardar imágenes

## 🐛 Problemas Conocidos & Soluciones

- **Java Version**: Gradle requiere una versión compatible de Java. Si tienes problemas al compilar, asegúrate de usar JDK 17 o 21 (o el incluido en Android Studio).

---

**Hecho con ❤️ para los amantes de los autos**
