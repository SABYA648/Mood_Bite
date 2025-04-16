/**
 * Nutrition Service
 * Generates realistic nutritional information for food items
 */

/**
 * Nutrition information structure
 */
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  healthScore: number;
}

// Food categories with typical nutritional profiles
type NutrientProfile = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
};

const NUTRITION_PROFILES: Record<string, NutrientProfile> = {
  // General food types
  burger: { calories: 650, protein: 30, carbs: 40, fat: 35, fiber: 2, sugar: 9, sodium: 980 },
  pizza: { calories: 300, protein: 12, carbs: 35, fat: 12, fiber: 2, sugar: 3, sodium: 600 },
  salad: { calories: 320, protein: 5, carbs: 20, fat: 22, fiber: 4, sugar: 6, sodium: 360 },
  pasta: { calories: 380, protein: 12, carbs: 62, fat: 10, fiber: 3, sugar: 4, sodium: 500 },
  sandwich: { calories: 450, protein: 22, carbs: 45, fat: 16, fiber: 3, sugar: 6, sodium: 750 },
  soup: { calories: 220, protein: 10, carbs: 24, fat: 8, fiber: 2, sugar: 6, sodium: 850 },
  rice_dish: { calories: 350, protein: 8, carbs: 55, fat: 10, fiber: 2, sugar: 1, sodium: 420 },
  steak: { calories: 420, protein: 35, carbs: 0, fat: 28, fiber: 0, sugar: 0, sodium: 120 },
  chicken: { calories: 280, protein: 26, carbs: 0, fat: 16, fiber: 0, sugar: 0, sodium: 90 },
  fish: { calories: 200, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 60 },
  dessert: { calories: 380, protein: 4, carbs: 65, fat: 14, fiber: 1, sugar: 50, sodium: 150 },
  vegetable: { calories: 120, protein: 4, carbs: 10, fat: 7, fiber: 5, sugar: 4, sodium: 40 },
  
  // Dish-specific types
  burrito: { calories: 550, protein: 20, carbs: 70, fat: 22, fiber: 6, sugar: 4, sodium: 1200 },
  curry: { calories: 450, protein: 15, carbs: 35, fat: 25, fiber: 5, sugar: 8, sodium: 820 },
  sushi: { calories: 350, protein: 15, carbs: 60, fat: 5, fiber: 2, sugar: 10, sodium: 740 },
  noodles: { calories: 410, protein: 12, carbs: 65, fat: 12, fiber: 2, sugar: 3, sodium: 950 },
  wrap: { calories: 420, protein: 15, carbs: 40, fat: 18, fiber: 3, sugar: 4, sodium: 680 },
  bowl: { calories: 480, protein: 18, carbs: 68, fat: 14, fiber: 6, sugar: 6, sodium: 580 },
  stir_fry: { calories: 380, protein: 20, carbs: 30, fat: 18, fiber: 4, sugar: 6, sodium: 1100 },
  taco: { calories: 210, protein: 9, carbs: 20, fat: 10, fiber: 3, sugar: 2, sodium: 400 },
  omelette: { calories: 320, protein: 18, carbs: 6, fat: 24, fiber: 1, sugar: 2, sodium: 580 },
  pie: { calories: 450, protein: 8, carbs: 50, fat: 24, fiber: 2, sugar: 22, sodium: 540 },
  
  // Ingredient specific
  mushroom: { calories: -50, protein: 3, carbs: -5, fat: -2, fiber: 2, sugar: -1, sodium: -20 },
  cheese: { calories: 80, protein: 6, carbs: 1, fat: 6, fiber: 0, sugar: 0, sodium: 170 },
  beans: { calories: 50, protein: 7, carbs: 20, fat: 0, fiber: 7, sugar: 0, sodium: 0 },
  rice_ingredient: { calories: 120, protein: 2, carbs: 25, fat: 1, fiber: 0, sugar: 0, sodium: 0 },
  chickpeas: { calories: 70, protein: 5, carbs: 13, fat: 2, fiber: 4, sugar: 2, sodium: 5 },
  tofu: { calories: -30, protein: 8, carbs: 2, fat: 5, fiber: 1, sugar: 0, sodium: 10 },
  
  // Dietary preferences
  veg: { calories: -50, protein: -5, carbs: 5, fat: -5, fiber: 3, sugar: 0, sodium: -100 },
  nonVeg: { calories: 50, protein: 8, carbs: -5, fat: 8, fiber: -1, sugar: 0, sodium: 100 },
  egg: { calories: 20, protein: 6, carbs: 0, fat: 5, fiber: 0, sugar: 0, sodium: 70 },
  
  // Cooking methods
  fried: { calories: 150, protein: 0, carbs: 10, fat: 15, fiber: -1, sugar: 0, sodium: 200 },
  grilled: { calories: -50, protein: 2, carbs: -2, fat: -5, fiber: 0, sugar: 0, sodium: -50 },
  baked: { calories: -20, protein: 0, carbs: 0, fat: -3, fiber: 0, sugar: 0, sodium: -30 },
  roasted: { calories: 30, protein: 1, carbs: 0, fat: 3, fiber: 0, sugar: 0, sodium: 50 },
  steamed: { calories: -80, protein: 0, carbs: 0, fat: -8, fiber: 0, sugar: 0, sodium: -100 },
  braised: { calories: -30, protein: 2, carbs: 0, fat: -3, fiber: 0, sugar: 0, sodium: 80 },
  
  // Cuisine types
  italian: { calories: 40, protein: 2, carbs: 10, fat: 5, fiber: 2, sugar: 2, sodium: 150 },
  mexican: { calories: 60, protein: 4, carbs: 15, fat: 8, fiber: 4, sugar: 2, sodium: 300 },
  indian: { calories: 50, protein: 3, carbs: 12, fat: 10, fiber: 3, sugar: 4, sodium: 250 },
  chinese: { calories: 30, protein: 2, carbs: 20, fat: 6, fiber: 2, sugar: 8, sodium: 700 },
  japanese: { calories: -30, protein: 5, carbs: 10, fat: -5, fiber: 2, sugar: 5, sodium: 400 },
  mediterranean: { calories: -20, protein: 3, carbs: 8, fat: 10, fiber: 4, sugar: -1, sodium: -50 },
  vietnamese: { calories: -40, protein: 4, carbs: 15, fat: -7, fiber: 3, sugar: 4, sodium: 500 },
  korean: { calories: 20, protein: 5, carbs: 15, fat: 3, fiber: 3, sugar: 6, sodium: 600 },
  french: { calories: 80, protein: 4, carbs: 10, fat: 15, fiber: 1, sugar: 5, sodium: 200 },
  lebanese: { calories: -10, protein: 3, carbs: 12, fat: 8, fiber: 3, sugar: 2, sodium: 150 },
  caribbean: { calories: 40, protein: 3, carbs: 18, fat: 7, fiber: 3, sugar: 8, sodium: 180 },
  greek: { calories: 30, protein: 4, carbs: 8, fat: 12, fiber: 2, sugar: 3, sodium: 250 },
  ethiopian: { calories: 20, protein: 3, carbs: 25, fat: 5, fiber: 4, sugar: 2, sodium: 70 },
  brazilian: { calories: 70, protein: 6, carbs: 15, fat: 10, fiber: 2, sugar: 3, sodium: 220 },
  peruvian: { calories: 40, protein: 5, carbs: 20, fat: 6, fiber: 3, sugar: 4, sodium: 160 },
  
  // Descriptors
  spicy: { calories: 20, protein: 0, carbs: 0, fat: 2, fiber: 1, sugar: 0, sodium: 150 },
  sweet: { calories: 60, protein: -1, carbs: 15, fat: 0, fiber: -1, sugar: 12, sodium: -20 },
  rich: { calories: 100, protein: 2, carbs: 5, fat: 12, fiber: 0, sugar: 4, sodium: 100 },
  fresh: { calories: -40, protein: 0, carbs: -5, fat: -5, fiber: 2, sugar: -2, sodium: -100 },
  creamy: { calories: 80, protein: 2, carbs: 3, fat: 10, fiber: 0, sugar: 2, sodium: 60 },
  crunchy: { calories: 30, protein: 1, carbs: 8, fat: 2, fiber: 1, sugar: 0, sodium: 50 },
  tangy: { calories: 10, protein: 0, carbs: 5, fat: 0, fiber: 0, sugar: 3, sodium: 30 },
  savory: { calories: 30, protein: 2, carbs: 0, fat: 5, fiber: 0, sugar: -1, sodium: 120 },
  bitter: { calories: -10, protein: 0, carbs: -2, fat: 0, fiber: 1, sugar: -3, sodium: 0 },
  gourmet: { calories: 40, protein: 3, carbs: 5, fat: 6, fiber: 1, sugar: 2, sodium: 80 },
  homemade: { calories: -20, protein: 1, carbs: -3, fat: -2, fiber: 1, sugar: -2, sodium: -150 },
  
  // Default for unknown terms
  default: { calories: 350, protein: 12, carbs: 40, fat: 14, fiber: 2, sugar: 6, sodium: 400 }
};

// Health impact factors for calculating health score
const HEALTH_IMPACT = {
  protein: 1.0,  // Positive impact
  fiber: 1.2,    // Positive impact
  carbs: -0.2,   // Small negative impact
  fat: -0.8,     // Moderate negative impact
  sodium: -0.5,  // Moderate negative impact
  sugar: -1.0    // High negative impact
};

/**
 * Generate nutritional information for a dish based on its name and category
 * @param dishName The name of the dish
 * @param category Food category (veg, nonVeg, egg)
 * @returns Nutritional information
 */
export function generateNutritionInfo(dishName: string, category: string): NutritionInfo {
  const lowerName = dishName.toLowerCase();
  
  // Initialize with default values
  const nutrition: NutritionInfo = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    healthScore: 50,
  };
  
  // Start with a base profile
  const baseProfile = { ...NUTRITION_PROFILES.default };
  
  // Split name into components to identify food types, ingredients, cuisine, etc.
  const words = lowerName
    .replace(/&/g, ' ')
    .replace(/-/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/);
  
  // Track how many relevant terms were found for this dish
  let termsFound = 0;
  
  // Apply nutrition profiles based on words in the dish name
  for (const word of words) {
    // Skip short words
    if (word.length < 3) continue;
    
    // Check if this word matches any known profile
    for (const [term, profile] of Object.entries(NUTRITION_PROFILES)) {
      if (word.includes(term) || term.includes(word)) {
        // Apply this profile to the base nutrition values
        nutrition.calories += profile.calories;
        nutrition.protein += profile.protein;
        nutrition.carbs += profile.carbs;
        nutrition.fat += profile.fat;
        nutrition.fiber += profile.fiber;
        nutrition.sugar += profile.sugar;
        nutrition.sodium += profile.sodium;
        
        termsFound++;
        break; // Move to next word after finding a match
      }
    }
  }
  
  // If no terms were found in the dish name, use defaults
  if (termsFound === 0) {
    return {
      calories: baseProfile.calories,
      protein: baseProfile.protein,
      carbs: baseProfile.carbs,
      fat: baseProfile.fat,
      fiber: baseProfile.fiber,
      sugar: baseProfile.sugar,
      sodium: baseProfile.sodium,
      healthScore: 50,
    };
  }
  
  // Apply category-specific adjustments
  if (category && NUTRITION_PROFILES[category]) {
    const categoryProfile = NUTRITION_PROFILES[category];
    nutrition.calories += categoryProfile.calories;
    nutrition.protein += categoryProfile.protein;
    nutrition.carbs += categoryProfile.carbs;
    nutrition.fat += categoryProfile.fat;
    nutrition.fiber += categoryProfile.fiber;
    nutrition.sugar += categoryProfile.sugar;
    nutrition.sodium += categoryProfile.sodium;
  }
  
  // Ensure no negative values
  nutrition.calories = Math.max(150, nutrition.calories);
  nutrition.protein = Math.max(2, nutrition.protein);
  nutrition.carbs = Math.max(5, nutrition.carbs);
  nutrition.fat = Math.max(2, nutrition.fat);
  nutrition.fiber = Math.max(0, nutrition.fiber);
  nutrition.sugar = Math.max(0, nutrition.sugar);
  nutrition.sodium = Math.max(20, nutrition.sodium);
  
  // Add some randomization (±10%)
  const applyRandomization = (value: number): number => {
    const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    return Math.round(value * randomFactor);
  };
  
  nutrition.calories = applyRandomization(nutrition.calories);
  nutrition.protein = applyRandomization(nutrition.protein);
  nutrition.carbs = applyRandomization(nutrition.carbs);
  nutrition.fat = applyRandomization(nutrition.fat);
  nutrition.fiber = applyRandomization(nutrition.fiber);
  nutrition.sugar = applyRandomization(nutrition.sugar);
  nutrition.sodium = applyRandomization(nutrition.sodium);
  
  // Calculate health score (0-100) based on nutritional values
  let healthScore = 50; // Start at neutral point
  
  // Apply impact factors to score
  healthScore += (nutrition.protein / 50) * 20 * HEALTH_IMPACT.protein;
  healthScore += (nutrition.fiber / 30) * 15 * HEALTH_IMPACT.fiber;
  healthScore -= (nutrition.fat / 80) * 15 * Math.abs(HEALTH_IMPACT.fat);
  healthScore -= (nutrition.sugar / 50) * 20 * Math.abs(HEALTH_IMPACT.sugar);
  healthScore -= (nutrition.sodium / 2300) * 15 * Math.abs(HEALTH_IMPACT.sodium);
  healthScore -= (nutrition.carbs / 275) * 10 * Math.abs(HEALTH_IMPACT.carbs);
  
  // Vegetarian foods get a small bonus
  if (category === 'veg') {
    healthScore += 5;
  }
  
  // If dish name contains healthy indicators
  if (lowerName.includes('salad') || lowerName.includes('vegetable') || 
      lowerName.includes('steamed') || lowerName.includes('grilled')) {
    healthScore += 5;
  }
  
  // If dish has unhealthy indicators
  if (lowerName.includes('fried') || lowerName.includes('cream') || 
      lowerName.includes('sweet') || lowerName.includes('rich')) {
    healthScore -= 5;
  }
  
  // Constrain to 0-100 range
  nutrition.healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));
  
  return nutrition;
}

/**
 * Updates a food item with nutritional information if it doesn't already have it
 * @param item The food item to update
 * @returns The updated food item with nutritional information
 */
export function enrichFoodItemWithNutrition<T extends { dishName: string; category: string; calories?: number | null }>(
  item: T
): T & NutritionInfo {
  // Skip if already has nutrition info
  if (typeof item.calories === 'number' && item.calories > 0) {
    return item as T & NutritionInfo;
  }
  
  // Generate nutrition info based on dish name and category
  const nutritionInfo = generateNutritionInfo(item.dishName, item.category);
  
  // Return merged object
  return {
    ...item,
    ...nutritionInfo,
  };
}