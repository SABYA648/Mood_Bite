import { FC } from 'react';
import type { FoodItem } from '@shared/schema';

interface NutritionalTrackerProps {
  foodItem: FoodItem;
}

// Define recommended daily values for reference (in grams/mg)
const DAILY_VALUES = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fat: 78,
  fiber: 28,
  sugar: 50,
  sodium: 2300,
};

const NutritionalTracker: FC<NutritionalTrackerProps> = ({ foodItem }) => {
  // Calculate percentage of daily value for each nutrient
  const calculatePercentage = (value: number, nutrient: keyof typeof DAILY_VALUES): number => {
    if (!value) return 0;
    return Math.min(Math.round((value / DAILY_VALUES[nutrient]) * 100), 100);
  };

  // Map nutrient names to more user-friendly display names
  const NUTRIENT_LABELS: Record<string, string> = {
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Carbohydrates',
    fat: 'Fat',
    fiber: 'Fiber',
    sugar: 'Sugar',
    sodium: 'Sodium',
  };

  // Get color based on health impact
  // Green for positive nutrients (protein, fiber)
  // Yellow for neutral nutrients (calories, carbs)
  // Red for nutrients to limit (fat, sugar, sodium)
  const getNutrientColor = (nutrient: string): string => {
    const positiveNutrients = ['protein', 'fiber'];
    const neutralNutrients = ['calories', 'carbs'];
    const limitNutrients = ['fat', 'sugar', 'sodium'];
    
    if (positiveNutrients.includes(nutrient)) return 'bg-green-500';
    if (neutralNutrients.includes(nutrient)) return 'bg-yellow-500';
    if (limitNutrients.includes(nutrient)) return 'bg-red-500';
    return 'bg-gray-500';
  };
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Nutritional Impact</h3>
      
      <div className="space-y-3">
        {/* Health Score */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Health Score</span>
            <span className="text-sm font-semibold">{foodItem.healthScore || 50}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${foodItem.healthScore || 50}%` }}
            ></div>
          </div>
        </div>
        
        {/* Nutrients */}
        {Object.entries(NUTRIENT_LABELS).map(([nutrient, label]) => {
          const value = foodItem[nutrient as keyof FoodItem] as number || 0;
          const percentage = calculatePercentage(value, nutrient as keyof typeof DAILY_VALUES);
          const color = getNutrientColor(nutrient);
          
          return (
            <div key={nutrient}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{label}</span>
                <span className="text-xs">
                  {value} {nutrient !== 'calories' ? 'g' : ''} 
                  <span className="text-gray-500 ml-1">({percentage}% DV)</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`${color} h-1.5 rounded-full`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Dietary Info */}
      <div className="mt-4 flex flex-wrap gap-1">
        {foodItem.category === 'veg' && (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Vegetarian</span>
        )}
        {foodItem.category === 'egg' && (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">Contains Egg</span>
        )}
        {foodItem.category === 'nonVeg' && (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">Non-Vegetarian</span>
        )}
        {(foodItem.calories || 0) < 500 && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Low Calorie</span>
        )}
        {(foodItem.protein || 0) > 20 && (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">High Protein</span>
        )}
        {(foodItem.fiber || 0) > 5 && (
          <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs rounded-full">High Fiber</span>
        )}
      </div>
    </div>
  );
};

export default NutritionalTracker;