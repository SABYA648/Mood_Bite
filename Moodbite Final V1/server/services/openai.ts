import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MoodAnalysisResult {
  mood: string;
  foodSuggestions: string[];
  dietary: {
    isVeg: boolean;
    isEgg: boolean;
    isNonVeg: boolean;
  };
  sortPreference: string;
}

// Define a wide variety of moods we want to detect
const AVAILABLE_MOODS = [
  "happy", "joyful", "excited", "cheerful", "elated", "thrilled", "optimistic", "content",
  "sad", "melancholic", "gloomy", "depressed", "down", "blue", "heartbroken", "disappointed",
  "angry", "irritated", "furious", "enraged", "annoyed", "frustrated", "indignant", "bitter",
  "anxious", "nervous", "worried", "stressed", "overwhelmed", "tense", "uneasy", "apprehensive",
  "tired", "exhausted", "lethargic", "fatigued", "drained", "sleepy", "weary", "worn-out",
  "hungry", "starving", "ravenous", "peckish", "famished", "empty", "appetite", "craving",
  "romantic", "passionate", "affectionate", "loving", "tender", "intimate", "amorous", "sentimental",
  "bored", "disinterested", "indifferent", "apathetic", "unimpressed", "monotonous", "uninspired", "dull",
  "adventurous", "daring", "bold", "explorative", "curious", "brave", "venturesome", "spontaneous",
  "peaceful", "calm", "tranquil", "serene", "relaxed", "composed", "centered", "balanced",
  "energetic", "lively", "vibrant", "dynamic", "spirited", "animated", "enthusiastic", "zealous"
];

// Food pairing suggestions based on mood categories
const MOOD_FOOD_PAIRINGS = {
  happy: ["desserts", "ice cream", "pizza", "burgers", "chocolate", "cake", "pastries", "favorite foods"],
  joyful: ["colorful foods", "fresh fruit", "smoothies", "sweet pastries", "celebration dishes", "party platters"],
  excited: ["fancy dishes", "gourmet foods", "international cuisine", "special occasion meals", "deluxe versions"],
  
  sad: ["comfort food", "warm soup", "mac and cheese", "chocolate", "ice cream", "pasta", "mashed potatoes"],
  melancholic: ["warm stews", "hearty soups", "fresh bread", "tea with honey", "childhood favorites"],
  
  angry: ["spicy food", "bold flavors", "crunchy textures", "satisfying meals", "grilled meats", "intense dishes"],
  irritated: ["simple foods", "easy-to-eat items", "finger foods", "nutrient-dense options", "energy-boosting snacks"],
  
  anxious: ["calming teas", "nuts and seeds", "avocado toast", "banana", "dark chocolate", "whole grains"],
  stressed: ["green leafy vegetables", "herbal teas", "dark chocolate", "blueberries", "complex carbohydrates"],
  
  tired: ["energy-boosting foods", "protein-rich meals", "nuts", "coffee", "green tea", "wholesome breakfast items"],
  exhausted: ["nutrient-dense meals", "iron-rich foods", "quick energy snacks", "hydrating foods", "superfood bowls"],
  
  hungry: ["filling meals", "protein-rich dishes", "hearty portions", "satisfying comfort foods", "all-you-can-eat options"],
  starving: ["fast delivery options", "substantial meals", "loaded dishes", "buffet-style foods", "hearty platters"],
  
  romantic: ["aphrodisiac foods", "shared plates", "fondue", "chocolate-covered strawberries", "fine dining"],
  
  bored: ["exotic cuisines", "novel food combinations", "fusion dishes", "food challenges", "unexpected pairings"],
  
  adventurous: ["exotic cuisines", "unusual ingredients", "international street food", "rare delicacies", "bold combinations"],
  
  peaceful: ["light salads", "simple dishes", "fresh ingredients", "balanced meals", "mindful eating options"],
  
  energetic: ["superfoods", "protein bowls", "fresh juices", "energy-boosting ingredients", "colorful salads"]
};

/**
 * Maps a detected mood to one of our defined categories
 */
function mapToStandardMood(detectedMood: string): string {
  detectedMood = detectedMood.toLowerCase();
  
  // Check for exact match
  if (AVAILABLE_MOODS.includes(detectedMood)) {
    return detectedMood;
  }
  
  // Check for partial match
  for (const standardMood of AVAILABLE_MOODS) {
    if (detectedMood.includes(standardMood)) {
      return standardMood;
    }
  }
  
  // Default to hungry if no match found
  return "hungry";
}

/**
 * Get food suggestions based on mood
 */
function getFoodSuggestionsForMood(mood: string): string[] {
  const standardMood = mapToStandardMood(mood);
  
  // Find the closest mood category
  let moodCategory = "hungry"; // Default
  for (const category in MOOD_FOOD_PAIRINGS) {
    if (category === standardMood || (category.startsWith(standardMood) || standardMood.startsWith(category))) {
      moodCategory = category;
      break;
    }
  }
  
  // Get suggestions for that mood
  const suggestions = MOOD_FOOD_PAIRINGS[moodCategory as keyof typeof MOOD_FOOD_PAIRINGS] || MOOD_FOOD_PAIRINGS.hungry;
  
  // Randomize order to ensure variety
  return suggestions.sort(() => Math.random() - 0.5).slice(0, 4);
}

/**
 * Analyzes user's voice input to determine mood and food preferences
 * @param text The transcribed text from user's voice input
 */
export async function analyzeMoodAndPreferences(text: string): Promise<MoodAnalysisResult> {
  try {
    const prompt = `
      Analyze the following text from a user looking for food recommendations:
      
      "${text}"
      
      Return a JSON object with the following fields:
      1. mood: The primary emotion/mood expressed. Be very specific and detailed about the exact mood, not just general categories. 
         Choose from these moods: ${AVAILABLE_MOODS.join(', ')}
      2. foodSuggestions: Array of 3-5 food types or cuisines that would match this specific mood and request
      3. dietary: Object with boolean fields isVeg, isEgg, isNonVeg based on any dietary preferences mentioned
      4. sortPreference: Either "Rating" if user wants best food, "DeliveryTime" if they want quick delivery, or "Relevance" as default

      Only include explicitly mentioned preferences. Default to false for dietary preferences if not mentioned.
      
      EXTREMELY IMPORTANT: Ensure each query gets a different mood response, even if the input is similar. The mood should be creative and varied for each query.
    `;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a food recommendation assistant that understands people's moods and food preferences. Your goal is to detect very specific and nuanced moods, not just general categories. Always try to match with a different mood for variety."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9 // Higher temperature for more variety in responses
    });

    const analysisText = response.choices[0].message.content;
    if (!analysisText) {
      throw new Error("Empty response from OpenAI");
    }

    const analysis = JSON.parse(analysisText) as MoodAnalysisResult;
    
    // Ensure response has a valid mood and food suggestions
    if (!analysis.mood || analysis.mood === "neutral" || analysis.foodSuggestions.length === 0) {
      // Supplement with our own suggestions
      if (!analysis.mood || analysis.mood === "neutral") {
        // Choose a random mood from our list
        const randomIndex = Math.floor(Math.random() * AVAILABLE_MOODS.length);
        analysis.mood = AVAILABLE_MOODS[randomIndex];
      }
      
      if (analysis.foodSuggestions.length === 0) {
        analysis.foodSuggestions = getFoodSuggestionsForMood(analysis.mood);
      }
    }
    
    // Log what we're returning for debugging
    console.log(`Detected mood: ${analysis.mood}, with suggestions: ${analysis.foodSuggestions.join(', ')}`);
    
    return analysis;
  } catch (error) {
    console.error("Error analyzing mood with OpenAI:", error);
    
    // Generate a fallback response with variety
    const randomMoodIndex = Math.floor(Math.random() * AVAILABLE_MOODS.length);
    const randomMood = AVAILABLE_MOODS[randomMoodIndex];
    const foodSuggestions = getFoodSuggestionsForMood(randomMood);
    
    // Return fallback values if analysis fails
    return {
      mood: randomMood,
      foodSuggestions: foodSuggestions,
      dietary: {
        isVeg: false,
        isEgg: false,
        isNonVeg: false
      },
      sortPreference: "Relevance"
    };
  }
}