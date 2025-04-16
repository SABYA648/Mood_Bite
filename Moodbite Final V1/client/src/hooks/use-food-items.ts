import { useQuery } from "@tanstack/react-query";
import type { FoodItem } from "@shared/schema";

// Interface for food items fetch options
export interface FetchFoodItemsOptions {
  refreshImages?: boolean;
}

// Advanced fetch function to get food items with cache busting and randomization
async function fetchFoodItems({ refreshImages }: FetchFoodItemsOptions = {}): Promise<FoodItem[]> {
  // Add timestamp & random value for cache busting to get different items with each request
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  
  // Build URL parameters
  const params = new URLSearchParams({
    t: timestamp.toString(),
    r: random.toString()
  });
  
  // Add refresh_images parameter if needed
  if (refreshImages) {
    params.append('refresh_images', 'true');
  }
  
  // Create unique URL with query parameters 
  const url = `/api/food-items?${params.toString()}`;
  
  // Set cache control headers to prevent browser caching
  const requestOptions = {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };
  
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    throw new Error('Failed to fetch food items');
  }
  
  return response.json();
}

// Interface for fetch food item by ID options
interface FetchFoodItemByIdOptions {
  refresh?: boolean;
}

// Fetch individual food item with cache busting
async function fetchFoodItemById(id: number, options: FetchFoodItemByIdOptions = {}): Promise<FoodItem> {
  // Add timestamp for cache busting
  const timestamp = new Date().getTime();
  
  // Build URL parameters
  const params = new URLSearchParams({
    t: timestamp.toString()
  });
  
  // Add refresh parameter if needed (to fetch a fresh image from Unsplash)
  if (options.refresh) {
    params.append('refresh', 'true');
  }
  
  // Create unique URL with query parameters to break cache
  const url = `/api/food-items/${id}?${params.toString()}`;
  
  // Set cache control headers to prevent browser caching
  const requestOptions = {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };
  
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch food item with id ${id}`);
  }
  
  return response.json();
}

export function useFoodItems(options: FetchFoodItemsOptions = {}) {
  return useQuery<FoodItem[]>({
    queryKey: ['/api/food-items', options.refreshImages ? 'refresh' : 'standard'],
    queryFn: () => fetchFoodItems(options)
  });
}

export function useFoodItemById(id: number | undefined, options: FetchFoodItemByIdOptions = {}) {
  return useQuery<FoodItem>({
    queryKey: ['/api/food-items', id, options.refresh ? 'refresh' : 'standard'],
    queryFn: () => fetchFoodItemById(id as number, options),
    enabled: !!id // Only run the query if id is provided
  });
}