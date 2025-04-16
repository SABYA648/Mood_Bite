import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ColorPalette, defaultPalette, getMoodPalette } from '@/utils/colorPalettes';

// Interface for the context value
interface ColorContextType {
  palette: ColorPalette;
  updatePalette: (mood: string) => void;
  applyGradientStyle: (element: string) => React.CSSProperties;
}

// Create the context with a default value
const ColorContext = createContext<ColorContextType>({
  palette: defaultPalette,
  updatePalette: () => {},
  applyGradientStyle: () => ({}),
});

// Provider component
export const ColorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold the current color palette
  const [palette, setPalette] = useState<ColorPalette>(defaultPalette);
  
  // Update the palette based on the detected mood
  const updatePalette = (mood: string) => {
    const newPalette = getMoodPalette(mood);
    setPalette(newPalette);
    
    // Apply palette to CSS variables
    applyPaletteToDocument(newPalette);
  };
  
  // Helper function to convert hex to RGB values
  const hexToRgb = (hex: string): [number, number, number] => {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return [r, g, b];
  };
  
  // Apply palette colors to CSS variables for global styling
  const applyPaletteToDocument = (palette: ColorPalette) => {
    const root = document.documentElement;
    
    // Set CSS variables for hex colors
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-secondary', palette.secondary);
    root.style.setProperty('--color-bg-start', palette.background.start);
    root.style.setProperty('--color-bg-end', palette.background.end);
    root.style.setProperty('--color-text-heading', palette.text.heading);
    root.style.setProperty('--color-text-body', palette.text.body);
    root.style.setProperty('--color-card-bg', palette.card.background);
    root.style.setProperty('--color-card-border', palette.card.border);
    
    // Set RGB values for animations
    const primaryRGB = hexToRgb(palette.primary);
    const secondaryRGB = hexToRgb(palette.secondary);
    
    root.style.setProperty('--color-primary-rgb', primaryRGB.join(', '));
    root.style.setProperty('--color-secondary-rgb', secondaryRGB.join(', '));
    
    // Set semi-transparent values
    root.style.setProperty('--color-primary-transparent', `rgba(${primaryRGB.join(', ')}, 0.6)`);
    root.style.setProperty('--color-secondary-transparent', `rgba(${secondaryRGB.join(', ')}, 0.5)`);
    
    // Apply transition to all color changes
    root.style.setProperty('--transition-colors', 'all 0.5s ease');
  };
  
  // Helper function to generate gradient style objects for components
  const applyGradientStyle = (element: string): React.CSSProperties => {
    switch (element) {
      case 'heroBackground':
        return {
          background: `linear-gradient(to right, ${palette.background.start}, ${palette.background.end})`,
          transition: 'background 0.5s ease',
        };
      case 'card':
        return {
          backgroundColor: palette.card.background,
          borderColor: palette.card.border,
          transition: 'all 0.5s ease',
        };
      case 'button':
        return {
          backgroundColor: palette.primary,
          color: 'white',
          transition: 'background-color 0.3s ease',
        };
      case 'buttonHover':
        return {
          backgroundColor: palette.secondary,
          color: 'white',
          transition: 'background-color 0.3s ease',
        };
      default:
        return {};
    }
  };
  
  // Apply default palette on first render
  useEffect(() => {
    applyPaletteToDocument(defaultPalette);
  }, []);
  
  return (
    <ColorContext.Provider 
      value={{ 
        palette, 
        updatePalette,
        applyGradientStyle
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

// Custom hook for using the color context
export const useColorContext = () => useContext(ColorContext);