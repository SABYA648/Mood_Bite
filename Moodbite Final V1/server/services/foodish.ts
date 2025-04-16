/**
 * Foodish API Service - BACKUP FALLBACK IMPLEMENTATION
 * Note: The original Foodish API at https://foodish-api.herokuapp.com appears to be down
 * This implementation uses fallback food image URLs and simulates the API's behavior
 */

// Collection of high-quality food images for different categories to use as fallbacks
const foodImageCollection = {
  pizza: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
  ],
  burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
    "https://images.unsplash.com/photo-1550317138-10000687a72b"
  ],
  pasta: [
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
    "https://images.unsplash.com/photo-1548234979-f5d264ee89a5",
    "https://images.unsplash.com/photo-1556761223-4c4282c73f77",
    "https://images.unsplash.com/photo-1622973536968-3ead9e780960"
  ],
  rice: [
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
    "https://images.unsplash.com/photo-1607118750353-75a320737c3a"
  ],
  dessert: [
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307",
    "https://images.unsplash.com/photo-1574085733277-851d9d856a3a",
    "https://images.unsplash.com/photo-1542124948-dc391252a940"
  ],
  salad: [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe",
    "https://images.unsplash.com/photo-1607532941433-304659e8198a"
  ],
  curry: [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    "https://images.unsplash.com/photo-1617692855027-33b14f061079",
    "https://images.unsplash.com/photo-1604152135912-04a022e23696",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641"
  ],
  soup: [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd",
    "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d",
    "https://images.unsplash.com/photo-1605709303005-0acc95476660",
    "https://images.unsplash.com/photo-1616501268912-adb687bba81e"
  ],
  chicken: [
    "https://images.unsplash.com/photo-1580554530778-ca36943938b2",
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c6",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
    "https://images.unsplash.com/photo-1527477396000-e27163b481c2"
  ],
  general: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
    "https://images.unsplash.com/photo-1484980972926-edee96e0960d",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327",
    "https://images.unsplash.com/photo-1432139509613-5c4255815697"
  ]
};

/**
 * Fetch a random food image from our collection
 * @returns URL of a random food image
 */
export async function fetchRandomFoodImage(): Promise<string | null> {
  try {
    // Get all images from all categories
    const allImages = Object.values(foodImageCollection).flat();
    
    // Pick a random image
    const randomIndex = Math.floor(Math.random() * allImages.length);
    const randomImage = allImages[randomIndex];
    
    // Add cache-busting parameter to prevent browser caching
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 1000);
    const cacheBuster = `?t=${timestamp}-${randomSeed}`;
    
    console.log('Using local Foodish fallback image collection');
    return `${randomImage}${cacheBuster}`;
  } catch (error) {
    console.error('Error with local food image collection:', error);
    return null;
  }
}

/**
 * Fetch multiple random food images
 * @param count Number of images to fetch
 * @returns Array of image URLs
 */
export async function fetchMultipleFoodImages(count: number = 1): Promise<string[]> {
  try {
    const images: string[] = [];
    
    // Foodish API doesn't have a built-in multiple image endpoint
    // So we need to make multiple requests
    const promises = Array(count).fill(0).map(() => fetchRandomFoodImage());
    const results = await Promise.all(promises);
    
    // Filter out null results
    return results.filter(url => url !== null) as string[];
  } catch (error) {
    console.error('Error fetching multiple food images:', error);
    return [];
  }
}

/**
 * Fetch a food image by category from local collection
 * @param category Food category (pizza, burger, pasta, etc.)
 * @returns Image URL or null if not found
 */
export async function fetchFoodImageByCategory(category: string): Promise<string | null> {
  try {
    // Normalize the category
    const normalizedCategory = normalizeFoodCategory(category);
    
    // Get images for the specified category, or general images if category not found
    let categoryImages: string[] = [];
    
    if (normalizedCategory && normalizedCategory in foodImageCollection) {
      // Use the normalized category directly
      categoryImages = foodImageCollection[normalizedCategory as keyof typeof foodImageCollection];
      console.log(`Found ${categoryImages.length} images for category: ${normalizedCategory}`);
    } else if (category.toLowerCase().includes('pizza')) {
      categoryImages = foodImageCollection.pizza;
    } else if (category.toLowerCase().includes('burger')) {
      categoryImages = foodImageCollection.burger;
    } else if (category.toLowerCase().includes('pasta') || category.toLowerCase().includes('noodle')) {
      categoryImages = foodImageCollection.pasta;
    } else if (category.toLowerCase().includes('rice')) {
      categoryImages = foodImageCollection.rice;
    } else if (category.toLowerCase().includes('dessert') || category.toLowerCase().includes('sweet')) {
      categoryImages = foodImageCollection.dessert;
    } else if (category.toLowerCase().includes('salad')) {
      categoryImages = foodImageCollection.salad;
    } else if (category.toLowerCase().includes('curry')) {
      categoryImages = foodImageCollection.curry;
    } else if (category.toLowerCase().includes('soup')) {
      categoryImages = foodImageCollection.soup;
    } else if (category.toLowerCase().includes('chicken')) {
      categoryImages = foodImageCollection.chicken;
    } else {
      // Default to general food images
      categoryImages = foodImageCollection.general;
      console.log(`No specific category match for "${category}", using general food images`);
    }
    
    // Pick a random image from the category
    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    const randomImage = categoryImages[randomIndex];
    
    // Add cache-busting parameter to prevent browser caching
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 1000);
    const cacheBuster = `?t=${timestamp}-${randomSeed}`;
    
    console.log(`Using local image from category ${normalizedCategory || 'general'} for term: ${category}`);
    return `${randomImage}${cacheBuster}`;
  } catch (error) {
    console.error(`Error fetching image for category ${category}:`, error);
    // Fall back to random image from all categories
    return fetchRandomFoodImage();
  }
}

/**
 * Map a food term to a valid Foodish API category
 * @param foodTerm The food term/category to normalize
 * @returns A valid Foodish category or null if no match
 */
function normalizeFoodCategory(foodTerm: string): string | null {
  const term = foodTerm.toLowerCase();
  
  // Our local collection supports these categories
  const validCategories = [
    'pizza', 'burger', 'pasta', 'rice', 'dessert', 'salad', 'curry', 'soup', 'chicken', 'general'
  ];
  
  // Direct matches
  if (validCategories.includes(term)) {
    return term;
  }
  
  // Partial matches and synonyms
  if (term.includes('pizza') || term.includes('pie')) return 'pizza';
  if (term.includes('burger') || term.includes('sandwich')) return 'burger';
  if (term.includes('pasta') || term.includes('noodle') || term.includes('spaghetti')) return 'pasta';
  if (term.includes('rice') || term.includes('risotto') || term.includes('paella')) return 'rice';
  if (term.includes('dessert') || term.includes('cake') || term.includes('sweet') || 
      term.includes('ice cream') || term.includes('chocolate')) return 'dessert';
  if (term.includes('salad') || term.includes('vegetable') || term.includes('greens')) return 'salad';
  if (term.includes('curry') || term.includes('indian') || term.includes('spicy')) return 'curry';
  if (term.includes('soup') || term.includes('stew') || term.includes('broth')) return 'soup';
  if (term.includes('chicken') || term.includes('poultry')) return 'chicken';
  
  // No match found, return null (will trigger general category)
  return null;
}

/**
 * Create a foodish API compatible response
 * This helps maintain compatibility with code expecting the original API format
 */
export function createFoodishResponse(imageUrl: string): { image: string } {
  return { 
    image: imageUrl 
  };
}

/**
 * Get a list of available food categories 
 */
export function getAvailableFoodCategories(): string[] {
  return Object.keys(foodImageCollection);
}