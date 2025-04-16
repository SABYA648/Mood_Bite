import { useMutation } from "@tanstack/react-query";
import type { FoodItem } from "@shared/schema";

export interface AdvancedFoodRequest {
  keywords: string[];
  cuisineTypes: string[];
  flavors: string[];
  dietaryRestrictions: string[];
  mealType: string;
  preparationMethod: string[];
  ingredients: {
    include: string[];
    exclude: string[];
  };
  healthFocus: string[];
  occasion: string;
  priority: "taste" | "speed" | "price" | "healthiness" | "variety";
}

export interface AdvancedFoodRequestResult {
  mood: string;
  foodSuggestions: string[];
  complexAnalysis: AdvancedFoodRequest;
  filteredItems: FoodItem[];
}

/**
 * Makes an API request to analyze complex food requests using advanced NLP
 */
async function analyzeFoodRequest(text: string): Promise<AdvancedFoodRequestResult> {
  // Add a timestamp to prevent caching and ensure we get fresh results each time
  const timestamp = new Date().getTime();
  
  const response = await fetch(`/api/advanced-food-request?t=${timestamp}`, {
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
      timestamp // Also include the timestamp in the body to affect the response calculation
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze food request');
  }
  
  return response.json();
}

/**
 * Hook for analyzing complex food requests with advanced NLP
 */
export function useAdvancedFoodRequest() {
  return useMutation({
    mutationFn: analyzeFoodRequest
  });
}