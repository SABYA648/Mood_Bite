/**
 * Color Palettes for Different Moods
 * 
 * This utility maps detected moods to appropriate color schemes.
 * Each palette contains:
 * - primary: Main accent color
 * - secondary: Secondary/complementary color
 * - background: Subtle background gradient colors
 * - text: Text color variations
 */

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: {
    start: string;
    end: string;
  };
  text: {
    heading: string;
    body: string;
  };
  card: {
    background: string;
    border: string;
  };
}

// Default palette - used when no mood is detected
export const defaultPalette: ColorPalette = {
  primary: '#F47280', // Soft red
  secondary: '#6366F1', // Indigo
  background: {
    start: '#FDF2F8', // Pink 50
    end: '#EFF6FF',   // Blue 50
  },
  text: {
    heading: '#111827', // Gray 900
    body: '#4B5563',    // Gray 600
  },
  card: {
    background: '#FFFFFF',
    border: '#E5E7EB',
  }
};

// Mapping of mood keywords to color palettes
const moodPalettes: Record<string, ColorPalette> = {
  // Happy, joyful moods - warm, bright colors
  happy: {
    primary: '#F59E0B',  // Amber 500
    secondary: '#D97706', // Amber 600
    background: {
      start: '#FFFBEB', // Amber 50
      end: '#FEF3C7',   // Amber 100
    },
    text: {
      heading: '#92400E', // Amber 800
      body: '#B45309',    // Amber 700
    },
    card: {
      background: '#FFFFFF',
      border: '#FDE68A', // Amber 200
    }
  },
  
  excited: {
    primary: '#EF4444',  // Red 500
    secondary: '#F97316', // Orange 500
    background: {
      start: '#FEF2F2', // Red 50
      end: '#FFF7ED',   // Orange 50
    },
    text: {
      heading: '#991B1B', // Red 800
      body: '#B91C1C',    // Red 700
    },
    card: {
      background: '#FFFFFF',
      border: '#FECACA', // Red 200
    }
  },
  
  joyful: {
    primary: '#F97316',  // Orange 500
    secondary: '#FB923C', // Orange 400
    background: {
      start: '#FFF7ED', // Orange 50
      end: '#FFEDD5',   // Orange 100
    },
    text: {
      heading: '#9A3412', // Orange 800
      body: '#C2410C',    // Orange 700
    },
    card: {
      background: '#FFFFFF',
      border: '#FED7AA', // Orange 200
    }
  },
  
  // Calm, relaxed moods - cool, peaceful colors
  calm: {
    primary: '#0EA5E9',  // Sky 500
    secondary: '#0284C7', // Sky 600
    background: {
      start: '#F0F9FF', // Sky 50
      end: '#E0F2FE',   // Sky 100
    },
    text: {
      heading: '#075985', // Sky 800
      body: '#0369A1',    // Sky 700
    },
    card: {
      background: '#FFFFFF',
      border: '#BAE6FD', // Sky 200
    }
  },
  
  relaxed: {
    primary: '#10B981',  // Emerald 500
    secondary: '#059669', // Emerald 600
    background: {
      start: '#ECFDF5', // Emerald 50
      end: '#D1FAE5',   // Emerald 100
    },
    text: {
      heading: '#065F46', // Emerald 800
      body: '#047857',    // Emerald 700
    },
    card: {
      background: '#FFFFFF',
      border: '#A7F3D0', // Emerald 200
    }
  },
  
  peaceful: {
    primary: '#06B6D4',  // Cyan 500
    secondary: '#0891B2', // Cyan 600
    background: {
      start: '#ECFEFF', // Cyan 50
      end: '#CFFAFE',   // Cyan 100
    },
    text: {
      heading: '#155E75', // Cyan 800
      body: '#0E7490',    // Cyan 700
    },
    card: {
      background: '#FFFFFF',
      border: '#A5F3FC', // Cyan 200
    }
  },
  
  // Sad, melancholic moods - subdued, muted colors
  sad: {
    primary: '#6366F1',  // Indigo 500
    secondary: '#4F46E5', // Indigo 600
    background: {
      start: '#EEF2FF', // Indigo 50
      end: '#E0E7FF',   // Indigo 100
    },
    text: {
      heading: '#3730A3', // Indigo 800
      body: '#4338CA',    // Indigo 700
    },
    card: {
      background: '#FFFFFF',
      border: '#C7D2FE', // Indigo 200
    }
  },
  
  melancholic: {
    primary: '#8B5CF6',  // Violet 500
    secondary: '#7C3AED', // Violet 600
    background: {
      start: '#F5F3FF', // Violet 50
      end: '#EDE9FE',   // Violet 100
    },
    text: {
      heading: '#5B21B6', // Violet 800
      body: '#6D28D9',    // Violet 700
    },
    card: {
      background: '#FFFFFF',
      border: '#DDD6FE', // Violet 200
    }
  },
  
  // Angry, frustrated moods - strong, intense colors
  angry: {
    primary: '#DC2626',  // Red 600
    secondary: '#B91C1C', // Red 700
    background: {
      start: '#FEF2F2', // Red 50
      end: '#FEE2E2',   // Red 100
    },
    text: {
      heading: '#7F1D1D', // Red 900
      body: '#991B1B',    // Red 800
    },
    card: {
      background: '#FFFFFF',
      border: '#FECACA', // Red 200
    }
  },
  
  frustrated: {
    primary: '#DB2777',  // Pink 600
    secondary: '#BE185D', // Pink 700
    background: {
      start: '#FDF2F8', // Pink 50
      end: '#FCE7F3',   // Pink 100
    },
    text: {
      heading: '#831843', // Pink 900
      body: '#9D174D',    // Pink 800
    },
    card: {
      background: '#FFFFFF',
      border: '#FBCFE8', // Pink 200
    }
  },
  
  // Hungry, energetic moods - appetizing, stimulating colors
  hungry: {
    primary: '#EA580C',  // Orange 600
    secondary: '#C2410C', // Orange 700
    background: {
      start: '#FFF7ED', // Orange 50
      end: '#FFEDD5',   // Orange 100
    },
    text: {
      heading: '#7C2D12', // Orange 900
      body: '#9A3412',    // Orange 800
    },
    card: {
      background: '#FFFFFF',
      border: '#FED7AA', // Orange 200
    }
  },
  
  energetic: {
    primary: '#D97706',  // Amber 600
    secondary: '#B45309', // Amber 700
    background: {
      start: '#FFFBEB', // Amber 50
      end: '#FEF3C7',   // Amber 100
    },
    text: {
      heading: '#78350F', // Amber 900
      body: '#92400E',    // Amber 800
    },
    card: {
      background: '#FFFFFF',
      border: '#FDE68A', // Amber 200
    }
  },
  
  // Curious, thoughtful moods - intriguing, engaging colors
  curious: {
    primary: '#0D9488',  // Teal 600
    secondary: '#0F766E', // Teal 700
    background: {
      start: '#F0FDFA', // Teal 50
      end: '#CCFBF1',   // Teal 100
    },
    text: {
      heading: '#134E4A', // Teal 900
      body: '#115E59',    // Teal 800
    },
    card: {
      background: '#FFFFFF',
      border: '#99F6E4', // Teal 200
    }
  },
  
  thoughtful: {
    primary: '#2563EB',  // Blue 600
    secondary: '#1D4ED8', // Blue 700
    background: {
      start: '#EFF6FF', // Blue 50
      end: '#DBEAFE',   // Blue 100
    },
    text: {
      heading: '#1E3A8A', // Blue 900
      body: '#1E40AF',    // Blue 800
    },
    card: {
      background: '#FFFFFF',
      border: '#BFDBFE', // Blue 200
    }
  },
  
  // Romantic, dreamy moods - soft, warm colors
  romantic: {
    primary: '#EC4899',  // Pink 500
    secondary: '#DB2777', // Pink 600
    background: {
      start: '#FDF2F8', // Pink 50
      end: '#FCE7F3',   // Pink 100
    },
    text: {
      heading: '#9D174D', // Pink 800
      body: '#BE185D',    // Pink 700
    },
    card: {
      background: '#FFFFFF',
      border: '#FBCFE8', // Pink 200
    }
  },
  
  dreamy: {
    primary: '#8B5CF6',  // Violet 500
    secondary: '#7C3AED', // Violet 600
    background: {
      start: '#F5F3FF', // Violet 50
      end: '#EDE9FE',   // Violet 100
    },
    text: {
      heading: '#5B21B6', // Violet 800
      body: '#6D28D9',    // Violet 700
    },
    card: {
      background: '#FFFFFF',
      border: '#DDD6FE', // Violet 200
    }
  },
  
  // Sophisticated, elegant moods - refined, elegant colors
  sophisticated: {
    primary: '#4B5563',  // Gray 600
    secondary: '#374151', // Gray 700
    background: {
      start: '#F9FAFB', // Gray 50
      end: '#F3F4F6',   // Gray 100
    },
    text: {
      heading: '#111827', // Gray 900
      body: '#1F2937',    // Gray 800
    },
    card: {
      background: '#FFFFFF',
      border: '#E5E7EB', // Gray 200
    }
  },
  
  elegant: {
    primary: '#6B7280',  // Gray 500
    secondary: '#4B5563', // Gray 600
    background: {
      start: '#F9FAFB', // Gray 50
      end: '#F3F4F6',   // Gray 100
    },
    text: {
      heading: '#111827', // Gray 900
      body: '#1F2937',    // Gray 800
    },
    card: {
      background: '#FFFFFF',
      border: '#E5E7EB', // Gray 200
    }
  },
  
  // Cultural cuisine inspired moods
  spicy: {
    primary: '#DC2626',  // Red 600
    secondary: '#EA580C', // Orange 600
    background: {
      start: '#FEF2F2', // Red 50 
      end: '#FFF7ED',   // Orange 50
    },
    text: {
      heading: '#991B1B', // Red 800
      body: '#B91C1C',    // Red 700
    },
    card: {
      background: '#FFFFFF',
      border: '#FECACA', // Red 200
    }
  },
  
  exotic: {
    primary: '#D97706',  // Amber 600
    secondary: '#059669', // Emerald 600
    background: {
      start: '#FFFBEB', // Amber 50
      end: '#ECFDF5',   // Emerald 50
    },
    text: {
      heading: '#92400E', // Amber 800
      body: '#B45309',    // Amber 700
    },
    card: {
      background: '#FFFFFF',
      border: '#FDE68A', // Amber 200
    }
  },
  
  sweet: {
    primary: '#DB2777',  // Pink 600
    secondary: '#C026D3', // Fuchsia 600
    background: {
      start: '#FDF2F8', // Pink 50
      end: '#FAE8FF',   // Fuchsia 50
    },
    text: {
      heading: '#9D174D', // Pink 800
      body: '#BE185D',    // Pink 700
    },
    card: {
      background: '#FFFFFF',
      border: '#FBCFE8', // Pink 200
    }
  },
  
  savory: {
    primary: '#B45309',  // Amber 700
    secondary: '#92400E', // Amber 800
    background: {
      start: '#FFFBEB', // Amber 50
      end: '#FEF3C7',   // Amber 100
    },
    text: {
      heading: '#78350F', // Amber 900
      body: '#92400E',    // Amber 800
    },
    card: {
      background: '#FFFFFF',
      border: '#FDE68A', // Amber 200
    }
  },
};

/**
 * Get a color palette based on the detected mood
 * @param mood The detected mood text
 * @returns Matching color palette or default palette if no match
 */
export function getMoodPalette(mood: string): ColorPalette {
  // Convert mood to lowercase for consistent matching
  const lowerMood = mood.toLowerCase();
  
  // Check for direct matches
  for (const [key, palette] of Object.entries(moodPalettes)) {
    if (lowerMood.includes(key)) {
      return palette;
    }
  }
  
  // Check for partial matches in longer mood strings
  // This helps with complex mood descriptions like "feeling relaxed and peaceful"
  for (const [key, palette] of Object.entries(moodPalettes)) {
    if (lowerMood.includes(key)) {
      return palette;
    }
  }
  
  // Return default palette if no match found
  return defaultPalette;
}