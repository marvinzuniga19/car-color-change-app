# 🎨 ColorWheel - Auto Customizer

Una aplicación web progresiva (PWA) y móvil que permite personalizar los colores de tu auto mediante realidad aumentada.

![ColorWheel](public/apple-icon.png)

## ✨ Características

- 📸 **Captura de fotos** - Usa la cámara de tu dispositivo para tomar fotos de tu auto
- 🎨 **Editor de colores** - Pinta y personaliza los colores de tu vehículo con herramientas intuitivas
- 💾 **Gestión de proyectos** - Guarda, organiza y gestiona múltiples proyectos
- 📤 **Exportación** - Descarga tus diseños como PNG o JSON
- 📱 **PWA/Mobile** - Instálala como app en iOS, Android o escritorio
- 🌙 **Tema oscuro** - Diseño moderno con tema oscuro por defecto

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd car-color-change-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Producción

```bash
# Crear build estático
npm run build

# Previsualizar build
npm run start
```

### Build para Mobile (iOS/Android)

```bash
# Build para mobile
npm run build:mobile

# Sincronizar con Capacitor
npm run cap:sync

# Abrir en Android Studio
npx cap open android

# Abrir en Xcode
npx cap open ios
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (React 19)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Mobile**: Capacitor 8
- **PWA**: Service Worker + Manifest
- **Analytics**: Vercel Analytics

## 📁 Estructura del Proyecto

```
car-color-change-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout global
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── camera-capture.tsx # Captura de cámara
│   ├── color-editor.tsx   # Editor de colores
│   ├── project-manager.tsx# Gestión de proyectos
│   ├── export-dialog.tsx  # Diálogo de exportación
│   └── ui/               # Componentes UI
├── android/              # Proyecto Capacitor Android
├── ios/                  # Proyecto Capacitor iOS
├── public/               # Assets estáticos
└── capacitor.config.ts   # Configuración Capacitor
```

## 🎯 Uso

### 1. Crear un Nuevo Proyecto

1. Haz clic en "Nuevo Proyecto"
2. Toma una foto de tu auto con la cámara
3. Confirma la foto capturada

### 2. Editar Colores

1. Selecciona un color con el picker
2. Ajusta el tamaño del pincel
3. Haz clic o arrastra sobre el canvas para pintar
4. Usa "Deshacer" para resetear cambios

### 3. Guardar y Exportar

1. Haz clic en "Guardar Proyecto" para guardar localmente
2. Usa "Exportar" para descargar como imagen o JSON
3. Copia al portapapeles para compartir en redes sociales

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Analytics (opcional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Capacitor

Edita `capacitor.config.ts` para personalizar:

```typescript
const config: CapacitorConfig = {
  appId: "com.tuempresa.colorwheel",
  appName: "ColorWheel",
  webDir: "out",
};
```

## 📱 PWA

La aplicación está configurada como PWA y puede instalarse en:

- **iOS**: Safari > Compartir > Agregar a pantalla de inicio
- **Android**: Chrome > Menú > Instalar app
- **Desktop**: Chrome > Instalar ColorWheel

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Ejecutar linter
- `npm run build:mobile` - Build para mobile
- `npm run cap:sync` - Sincronizar Capacitor

## 🐛 Problemas Conocidos

- El historial de deshacer solo resetea la imagen completa
- Las imágenes se guardan en localStorage (límite ~5-10MB)
- El modo claro aún no está implementado

## 🗺️ Roadmap

- [ ] Implementar capas en el editor
- [ ] Agregar selección inteligente de áreas
- [ ] Migrar a IndexedDB para mejor almacenamiento
- [ ] Modo claro/oscuro toggle
- [ ] Sincronización en la nube
- [ ] Modo AR real con WebXR
- [ ] Detección de auto con ML

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Autores

- **Tu Nombre** - _Desarrollo inicial_

## 🙏 Agradecimientos

- Radix UI por los componentes accesibles
- Vercel por el hosting y analytics
- La comunidad de Next.js

---

**Hecho con ❤️ para los amantes de los autos**
