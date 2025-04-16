import { useMutation } from "@tanstack/react-query";
import type { FoodItem } from "@shared/schema";

export interface MoodAnalysisResult {
  mood: string;
  foodSuggestions: string[];
  dietary: {
    isVeg: boolean;
    isEgg: boolean;
    isNonVeg: boolean;
  };
  sortPreference: string;
  filteredItems: FoodItem[];
}

async function analyzeMood(text: string): Promise<MoodAnalysisResult> {
  // Add a timestamp to prevent caching and ensure we get fresh results each time
  const timestamp = new Date().getTime();
  
  const response = await fetch(`/api/analyze-mood?t=${timestamp}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add cache control headers to prevent any browser caching
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    body: JSON.stringify({ 
      text,
      timestamp // Also include in the body to affect the response calculation
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze mood');
  }
  
  return response.json();
}

export function useMoodAnalysis() {
  return useMutation({
    mutationFn: analyzeMood
  });
}