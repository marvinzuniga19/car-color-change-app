// Predefined car color palettes
export const carColorPalettes = {
  classic: {
    name: "Clásicos",
    colors: [
      { name: "Negro Profundo", hex: "#0a0a0a" },
      { name: "Blanco Perla", hex: "#f8f8f8" },
      { name: "Plata Metálico", hex: "#c0c0c0" },
      { name: "Gris Grafito", hex: "#4a4a4a" },
      { name: "Rojo Carmesí", hex: "#8b0000" },
    ],
  },
  metallic: {
    name: "Metálicos",
    colors: [
      { name: "Azul Metálico", hex: "#1e3a8a" },
      { name: "Verde Esmeralda", hex: "#047857" },
      { name: "Oro Champagne", hex: "#d4af37" },
      { name: "Bronce Oscuro", hex: "#8b4513" },
      { name: "Titanio", hex: "#878681" },
    ],
  },
  vibrant: {
    name: "Vibrantes",
    colors: [
      { name: "Rojo Ferrari", hex: "#dc143c" },
      { name: "Amarillo Racing", hex: "#ffd700" },
      { name: "Naranja Sunset", hex: "#ff6b35" },
      { name: "Azul Eléctrico", hex: "#0066ff" },
      { name: "Verde Lima", hex: "#32cd32" },
    ],
  },
  luxury: {
    name: "Lujo",
    colors: [
      { name: "Negro Carbón", hex: "#1a1a1a" },
      { name: "Azul Medianoche", hex: "#191970" },
      { name: "Borgoña", hex: "#800020" },
      { name: "Verde British", hex: "#004d40" },
      { name: "Gris Nardo", hex: "#808080" },
    ],
  },
  matte: {
    name: "Mate",
    colors: [
      { name: "Negro Mate", hex: "#28282b" },
      { name: "Gris Mate", hex: "#71797e" },
      { name: "Blanco Mate", hex: "#e8e8e8" },
      { name: "Azul Mate", hex: "#2c5f8d" },
      { name: "Verde Militar", hex: "#4b5320" },
    ],
  },
}

export type ColorPalette = keyof typeof carColorPalettes
