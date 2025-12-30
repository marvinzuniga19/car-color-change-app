import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wheele',
  appName: 'wheele',
  webDir: 'out',
  plugins: {
    Camera: {
      // Configuración para mejorar compatibilidad con la cámara
    }
  }
};

export default config;
