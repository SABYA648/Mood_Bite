import OpenAI from 'openai';
import { FoodItem } from '@shared/schema';

// Initialize OpenAI API client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const GPT_MODEL = "gpt-4o";

interface AdvancedFoodRequest {
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

/**
 * Analyzes a complex food request and extracts structured information
 */
export async function analyzeComplexFoodRequest(text: string): Promise<AdvancedFoodRequest> {
  try {
    const response = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a specialized AI trained to analyze food requests. Extract structured information from users' food preferences and create a detailed analysis in JSON format. 
          
          For complex food requests like "I want a quick healthy lunch that's gluten-free with chicken and veggies but no onions or tomatoes", provide a detailed structured analysis.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 1000
    });

    // Ensure response content is not null before parsing
    const content = response.choices[0].message.content;
    const contentText = typeof content === 'string' ? content : '{}';
    const result = JSON.parse(contentText) as AdvancedFoodRequest;

    // Normalize and provide default values for any missing fields
    return {
      keywords: result.keywords || [],
      cuisineTypes: result.cuisineTypes || [],
      flavors: result.flavors || [],
      dietaryRestrictions: result.dietaryRestrictions || [],
      mealType: result.mealType || '',
      preparationMethod: result.preparationMethod || [],
      ingredients: {
        include: result.ingredients?.include || [],
        exclude: result.ingredients?.exclude || []
      },
      healthFocus: result.healthFocus || [],
      occasion: result.occasion || '',
      priority: result.priority || 'taste'
    };
  } catch (error) {
    console.error('Error analyzing complex food request:', error);
    // Return a default structure if analysis fails
    return {
      keywords: [],
      cuisineTypes: [],
      flavors: [],
      dietaryRestrictions: [],
      mealType: '',
      preparationMethod: [],
      ingredients: {
        include: [],
        exclude: []
      },
      healthFocus: [],
      occasion: '',
      priority: 'taste'
    };
  }
}

/**
 * Scores food items based on the advanced analysis
 */
export function scoreItemsBasedOnAnalysis(
  items: FoodItem[],
  analysis: AdvancedFoodRequest,
  timestamp?: number
): FoodItem[] {
  // Create a copy of the items to avoid modifying the original array
  const scoredItems = [...items];
  
  // If we have a timestamp, log it for debugging
  if (timestamp) {
    console.log(`Advanced analysis randomization with timestamp: ${timestamp}, analysis type: ${analysis.priority}`);
    
    // Apply pre-shuffle based on analysis and timestamp
    // This ensures completely different ordering for different requests
    const analysisSeed = [
      ...analysis.keywords, 
      ...analysis.cuisineTypes, 
      ...analysis.flavors,
      analysis.mealType
    ].join('').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Deterministic but unique shuffle factor
    const shuffleFactor = (timestamp % 10000) + analysisSeed;
    const random = Math.floor(Math.random() * 10000);
    
    console.log(`Advanced analysis randomization seed: ${analysisSeed}, random: ${random}`);
    
    // Pre-shuffle items based on the combined factors
    scoredItems.sort(() => {
      // Create a deterministic but different ordering for each analysis
      return 0.5 - Math.sin(shuffleFactor / 1000);
    });
  }
  
  // Score each item based on matching criteria from the analysis
  scoredItems.forEach((item, index) => {
    // Initialize score for this item
    let score = 0;
    const itemLower = item.dishName.toLowerCase();
    
    // If we did a pre-shuffle, give some base score based on position
    // This preserves some of the initial randomization
    if (timestamp) {
      score += (scoredItems.length - index) / 10;
    }
    
    // Check for cuisine match
    if (analysis.cuisineTypes.some(cuisine => 
      itemLower.includes(cuisine.toLowerCase())
    )) {
      score += 5;
    }
    
    // Check for flavor match
    if (analysis.flavors.some(flavor => 
      itemLower.includes(flavor.toLowerCase())
    )) {
      score += 3;
    }
    
    // Check for ingredient matches (included)
    const ingredientMatchCount = analysis.ingredients.include.filter(ingredient => 
      itemLower.includes(ingredient.toLowerCase())
    ).length;
    score += ingredientMatchCount * 2;
    
    // Check for ingredient exclusions (negative score if excluded ingredients are present)
    const exclusionMatchCount = analysis.ingredients.exclude.filter(ingredient => 
      itemLower.includes(ingredient.toLowerCase())
    ).length;
    score -= exclusionMatchCount * 10; // Strong penalty for excluded ingredients
    
    // Check for meal type match
    if (analysis.mealType && itemLower.includes(analysis.mealType.toLowerCase())) {
      score += 4;
    }
    
    // Check for preparation method match
    if (analysis.preparationMethod.some(method => 
      itemLower.includes(method.toLowerCase())
    )) {
      score += 3;
    }
    
    // Check for health focus match
    if (analysis.healthFocus.some(focus => 
      itemLower.includes(focus.toLowerCase())
    )) {
      score += 2;
    }
    
    // Check for keyword matches
    const keywordMatchCount = analysis.keywords.filter(keyword => 
      itemLower.includes(keyword.toLowerCase())
    ).length;
    score += keywordMatchCount * 2;
    
    // Add stronger randomness factor (increased from 20 to 35)
    score += Math.random() * 35;
    
    // Also add timestamp-based randomization if available
    if (timestamp) {
      // Use multiple factors based on timestamp and item properties for better randomization
      const idFactor = (item.id % 100) / 100;
      const priceFactor = parseInt(item.price.replace('$', '')) / 10;
      const timestampFactor = (timestamp % 10000) / 10000;
      
      // Combine multiple factors for better distribution
      const combinedFactor = (idFactor + priceFactor + timestampFactor) * 25;
      
      // Log for debugging if it's a special timestamp
      if (timestamp % 1000 === 0) {
        console.log(`Special randomization for item ${item.id}: factor=${combinedFactor.toFixed(2)}`);
      }
      
      // Add a much stronger random adjustment based on timestamp (increased from 8 to 25)
      score += combinedFactor;
    }
    
    // Add score to item for sorting
    (item as any).relevanceScore = score;
  });
  
  // Sort items by score (descending) and remove items with negative scores
  const filteredItems = scoredItems
    .filter(item => (item as any).relevanceScore >= 0)
    .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
  
  // Randomize order for items with similar scores to ensure variety
  const randomizedItems = randomizeGroupsWithSimilarScores(filteredItems);
  
  // Return all items so the frontend can show as many as needed
  // This ensures different moods get different sets of foods
  return randomizedItems;
}

/**
 * Helper function to add some randomization to items with similar scores
 */
function randomizeGroupsWithSimilarScores(items: FoodItem[]): FoodItem[] {
  const result: FoodItem[] = [];
  let currentGroup: FoodItem[] = [];
  let currentScore: number | null = null;
  
  // Group items with the same score
  items.forEach(item => {
    const score = (item as any).relevanceScore;
    
    if (currentScore === null) {
      currentScore = score;
      currentGroup.push(item);
    } else if (Math.abs(score - currentScore) <= 5) { // Items with scores within 5 points are considered similar (increased from 2)
      currentGroup.push(item);
    } else {
      // Shuffle the current group and add to result
      shuffleArray(currentGroup);
      result.push(...currentGroup);
      
      // Start a new group
      currentGroup = [item];
      currentScore = score;
    }
  });
  
  // Add the last group
  if (currentGroup.length > 0) {
    shuffleArray(currentGroup);
    result.push(...currentGroup);
  }
  
  return result;
}

/**
 * Helper function to shuffle an array in-place
 */
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}