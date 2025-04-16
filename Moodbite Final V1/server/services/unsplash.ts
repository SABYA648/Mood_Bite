import { createApi } from 'unsplash-js';
import fetch from 'node-fetch';

/**
 * Ensure the Unsplash API key is provided
 */
if (!process.env.UNSPLASH_ACCESS_KEY) {
  console.warn('UNSPLASH_ACCESS_KEY environment variable is not set. Unsplash API will not work properly.');
}

// Add global type declaration for rate limit tracking
declare global {
  var __unsplashRateLimited: boolean;
}

// Initialize the global rate limit flag if not set
if (global.__unsplashRateLimited === undefined) {
  global.__unsplashRateLimited = false;
}

/**
 * Create the Unsplash API client 
 * Using the recommended configuration based on Unsplash documentation
 */
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
  fetch: fetch as any
});

/**
 * Fetches an image URL from Unsplash based on the provided query
 * @param query The search term(s) to find images on Unsplash
 * @param count Number of images to return (default: 1)
 * @returns Array of image URLs or null if not found
 */
export async function fetchImageUrls(query: string, count: number = 1): Promise<string[] | null> {
  try {
    // Verify we have an API key
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error('Cannot fetch images: UNSPLASH_ACCESS_KEY is not set');
      return null;
    }
    
    // Add random order parameter to ensure different images each time
    const orderBy = Math.random() > 0.5 ? 'latest' : 'relevant';
    
    // Add a unique timestamp to avoid browser/API caching
    const timestamp = Date.now();
    const randomizer = Math.floor(Math.random() * 1000);
    
    // Simplify query if it's too long (Unsplash API may reject very long queries)
    let processedQuery = query;
    if (query.length > 80) {
      // Take only the first few keywords if query is too long
      processedQuery = query.split(' ').slice(0, 4).join(' ');
    }
    
    // Add some randomization to the query to get more variety
    // Keep the query simpler to avoid API errors but still add some variety
    const mealTerms = ['dish', 'meal', 'food', 'cuisine', 'recipe', 'plate'];
    const randomMealTerm = mealTerms[timestamp % mealTerms.length];
    const enhancedQuery = `${processedQuery} ${randomMealTerm}`;
    
    // Add fallback images - stock photos that will work if API fails
    const fallbackImages = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187"
    ];
    
    // Attempt to use Unsplash API with error handling
    try {
      // Check for any rate limit state we may have stored
      // Unsplash SDK doesn't expose the rate limit info directly so we need to track it ourselves
      const isRateLimited = global.__unsplashRateLimited === true;
      if (isRateLimited) {
        console.log('Unsplash API rate limit exceeded (from previous requests). Using fallback images.');
        throw new Error('Rate limit exceeded');
      }
      
      // Search for photos matching the query and limit the results
      const result = await unsplash.search.getPhotos({
        query: enhancedQuery,
        perPage: count > 5 ? 15 : 10, // Request more photos to select from randomly
        orderBy, // Randomize ordering
        orientation: 'landscape', // Prefer landscape orientation for food
      });
      
      // Check for rate limit headers in the response
      if (result.originalResponse && result.originalResponse.headers) {
        const remainingRequests = result.originalResponse.headers.get('x-ratelimit-remaining');
        if (remainingRequests === '0') {
          console.warn('⚠️ Unsplash API rate limit reached! Using fallbacks for future requests.');
          // Set global rate limit flag to prevent further API calls
          (global as any).__unsplashRateLimited = true;
          
          // Add automatic reset after 1 hour (3600000 ms)
          setTimeout(() => {
            console.log('Resetting Unsplash API rate limit flag after cooling period');
            (global as any).__unsplashRateLimited = false;
          }, 3600000);
        } else if (parseInt(remainingRequests || '50') < 10) {
          console.warn(`⚠️ Unsplash API rate limit running low: ${remainingRequests} requests remaining`);
        } else {
          // Make sure we're not rate limited if we get a successful response
          (global as any).__unsplashRateLimited = false;
        }
      }
  
      // Return image URLs if any are found
      if (result.response && result.response.results && result.response.results.length > 0) {
        // Log for attribution requirements
        console.log(`Using images from Unsplash for query: "${enhancedQuery}" - Photos by Unsplash photographers`);
        
        // Select random images from the results to ensure variety
        let images: string[] = [];
        const results = result.response.results;
        
        // Shuffle the results to get random images each time
        const shuffled = [...results].sort(() => 0.5 - Math.random());
        
        // Take only what we need
        const selectedResults = shuffled.slice(0, count);
        
        // Extract image URLs
        images = selectedResults.map(photo => {
          // Add cache-busting parameter to URLs to prevent browser caching
          const cacheBuster = `?t=${timestamp}-${randomizer}-${Math.floor(Math.random() * 1000)}`;
          return `${photo.urls.regular}${cacheBuster}`;
        });
        
        return images;
      }
    } catch (error: any) {
      // Check for specific error types and provide better messages
      if (error.status === 403) {
        console.error(`Unsplash API access forbidden. Check API key permissions or rate limits.`);
      } else if (error.status === 429 || (error.message && error.message.includes('rate limit'))) {
        console.error(`Unsplash API rate limit exceeded. Using fallback images.`);
      } else if (error.message && error.message.includes('JSON')) {
        console.error(`Unsplash API returned invalid response. Rate limit may be exceeded.`);
      } else {
        console.error(`Unsplash API error for query "${enhancedQuery}":`, error);
      }
      // Continue to fallback logic below
    }
    
    // If we get here, either the search failed or no results were found
    // Return random fallback images from our local collection
    console.log('Using fallback images for query:', query);
    
    // Shuffle fallback images based on timestamp to ensure different ones each time
    const shuffledFallbacks = [...fallbackImages].sort(() => 0.5 - Math.sin(timestamp));
    
    // Add cache-busting parameters to prevent caching
    return shuffledFallbacks.slice(0, count).map(url => {
      const cacheBuster = `?t=${timestamp}-${randomizer}-${Math.floor(Math.random() * 1000)}`;
      return `${url}${cacheBuster}`;
    });
  } catch (error) {
    console.error('Critical error fetching images:', error);
    return null;
  }
}

/**
 * Fetch a random food image from Unsplash with the given keywords
 * @param keywords Keywords to search for
 * @returns URL of the random image or null if not found
 */
export async function fetchRandomFoodImage(keywords: string): Promise<string | null> {
  try {
    // Verify we have an API key
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error('Cannot fetch random image: UNSPLASH_ACCESS_KEY is not set');
      return null;
    }
    
    // Add randomness to prevent identical results
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Define fallback images - these work when API calls fail
    const fallbackImages = [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", 
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
      "https://images.unsplash.com/photo-1432139509613-5c4255815697"
    ];
    
    // Simplify the keywords if they're too long
    let processedKeywords = keywords;
    if (keywords.length > 80) {
      // Take only the first few words if keywords are too long
      processedKeywords = keywords.split(' ').slice(0, 3).join(' ');
    }
    
    // Add "food" and additional randomization keywords to ensure variety
    const extraWords = [
      'delicious', 'gourmet', 'tasty', 'fresh', 'homemade', 
      'restaurant', 'cuisine', 'culinary', 'meal', 'dish'
    ];
    
    // Select 1-2 random words to add
    const selectedWords = [];
    selectedWords.push(extraWords[timestamp % extraWords.length]);
    if (randomSeed % 3 === 0) {
      selectedWords.push(extraWords[(timestamp + 1) % extraWords.length]);
    }
    
    // Build the enhanced query with randomization
    const baseKeywords = processedKeywords.includes('food') ? processedKeywords : `${processedKeywords} food`;
    const enhancedQuery = `${baseKeywords} ${selectedWords.join(' ')}`;
    
    try {
      // Check for any rate limit state we may have stored
      // Unsplash SDK doesn't expose the rate limit info directly so we need to track it ourselves
      const isRateLimited = global.__unsplashRateLimited === true;
      if (isRateLimited) {
        console.log('Unsplash API rate limit exceeded (from previous requests). Using fallback images.');
        throw new Error('Rate limit exceeded');
      }
      
      // Try one of two methods based on randomization (getRandom or search)
      if (randomSeed % 2 === 0) {
        try {
          // Method 1: Use the getRandom endpoint
          const result = await unsplash.photos.getRandom({
            query: enhancedQuery,
            count: 3, // Get 3 images and pick one randomly
            orientation: 'landscape',
          });
          
          // Check for rate limit headers in the response
          if (result.originalResponse && result.originalResponse.headers) {
            const remainingRequests = result.originalResponse.headers.get('x-ratelimit-remaining');
            if (remainingRequests === '0') {
              console.warn('⚠️ Unsplash API rate limit reached! Using fallbacks for future requests.');
              // Set global rate limit flag to prevent further API calls
              (global as any).__unsplashRateLimited = true;
              
              // Add automatic reset after 1 hour (3600000 ms)
              setTimeout(() => {
                console.log('Resetting Unsplash API rate limit flag after cooling period');
                (global as any).__unsplashRateLimited = false;
              }, 3600000);
            } else if (parseInt(remainingRequests || '50') < 10) {
              console.warn(`⚠️ Unsplash API rate limit running low: ${remainingRequests} requests remaining`);
            } else {
              // Make sure we're not rate limited if we get a successful response
              (global as any).__unsplashRateLimited = false;
            }
          }
    
          // Log for attribution requirements
          console.log(`Using random image from Unsplash for: "${enhancedQuery}" - Photo by Unsplash photographer`);
          
          // Extract the URL from the response
          if (Array.isArray(result.response) && result.response.length > 0) {
            // Select a random image from the results
            const randomIndex = Math.floor(Math.random() * result.response.length);
            const photo = result.response[randomIndex];
            
            // Add a cache-busting parameter to URL
            const cacheBuster = `?t=${timestamp}-${randomSeed}-${Math.floor(Math.random() * 1000)}`;
            return `${photo.urls.regular}${cacheBuster}`;
          } else if (result.response && !Array.isArray(result.response) && 'urls' in result.response) {
            // Add a cache-busting parameter to URL
            const cacheBuster = `?t=${timestamp}-${randomSeed}-${Math.floor(Math.random() * 1000)}`;
            return `${result.response.urls.regular}${cacheBuster}`;
          }
        } catch (randomError: any) {
          // Check for specific error types
          if (randomError.status === 403 || randomError.status === 429) {
            console.error(`Unsplash API rate limit reached (status ${randomError.status}). Trying fallback.`);
          } else if (randomError.message && randomError.message.includes('JSON')) {
            console.error('Unsplash API returned invalid response. Rate limit may be exceeded.');
          } else {
            console.error(`Error with Unsplash getRandom: ${randomError.message || 'Unknown error'}`);
          }
          // Continue to next method
        }
      }
      
      // Method 2: Fall back to search which often gives better results
      console.log(`Using search method for: "${enhancedQuery}"`);
      const searchResults = await fetchImageUrls(enhancedQuery, 1);
      if (searchResults && searchResults.length > 0) {
        return searchResults[0];
      }
      
      // If both methods failed, try one more approach with different keywords
      console.log('No images found, trying alternative keywords');
      const simpleKeywords = processedKeywords.split(' ')[0] + ' food dish';
      const finalResults = await fetchImageUrls(simpleKeywords, 1);
      if (finalResults && finalResults.length > 0) {
        return finalResults[0];
      }
    } catch (apiError: any) {
      // Check for specific error types and provide better messages
      if (apiError.status === 403) {
        console.error(`Unsplash API access forbidden. Check API key permissions or rate limits.`);
      } else if (apiError.status === 429 || (apiError.message && apiError.message.includes('rate limit'))) {
        console.error(`Unsplash API rate limit exceeded. Using fallback images.`);
      } else if (apiError.message && apiError.message.includes('JSON')) {
        console.error(`Unsplash API returned invalid response. Rate limit may be exceeded.`);
      } else {
        console.error(`API error with query "${enhancedQuery}":`, apiError);
      }
      // Continue to fallback logic
    }
    
    // If all API methods failed, use our fallback images
    console.log('Using fallback image for:', keywords);
    
    // Use the keyword and timestamp to deterministically pick an image
    // This ensures the same dish name gets the same image each time
    const keywordHash = keywords.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = (keywordHash + timestamp % 1000) % fallbackImages.length;
    
    // Add cache busting parameter
    const cacheBuster = `?t=${timestamp}-${randomSeed}-${Math.floor(Math.random() * 1000)}`;
    return `${fallbackImages[index]}${cacheBuster}`;
    
  } catch (error) {
    console.error('Critical error fetching random image:', error);
    
    // Last resort fallback - use the first fallback image with cache busting
    const timestamp = Date.now();
    const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
    const cacheBuster = `?t=${timestamp}-fallback`;
    return `${fallbackImg}${cacheBuster}`;
  }
}

/**
 * Builds a search query for food items based on dish characteristics
 * @param dishName The name of the dish
 * @param cuisine The cuisine type or restaurant name
 * @returns A tailored search query string
 */
export function buildFoodSearchQuery(dishName: string, cuisine: string): string {
  const lowercaseDish = dishName.toLowerCase();
  const lowercaseCuisine = cuisine.toLowerCase();
  let searchTerms = [];
  
  // Add the dish name as the primary search term
  searchTerms.push(dishName.replace(/&/g, 'and'));
  
  // Add cuisine as a search term if it's significant and not already in the dish name
  if (cuisine && !lowercaseDish.includes(lowercaseCuisine)) {
    // Extract cuisine from restaurant name if possible
    const cuisineWords = cuisine.split(' ');
    if (cuisineWords.length > 2) {
      // Use only first word of restaurant name if it's long
      searchTerms.push(cuisineWords[0]);
    } else {
      searchTerms.push(cuisine);
    }
  }
  
  // Add specific food category terms based on the dish name
  if (lowercaseDish.includes('salad')) {
    searchTerms.push('fresh salad plate');
  } else if (lowercaseDish.includes('pizza')) {
    searchTerms.push('gourmet pizza');
  } else if (lowercaseDish.includes('pasta')) {
    searchTerms.push('italian pasta dish');
  } else if (lowercaseDish.includes('burger')) {
    searchTerms.push('gourmet burger');
  } else if (lowercaseDish.includes('cake') || lowercaseDish.includes('dessert')) {
    searchTerms.push('dessert');
  } else if (lowercaseDish.includes('rice')) {
    searchTerms.push('rice dish');
  } else if (lowercaseDish.includes('soup')) {
    searchTerms.push('soup bowl');
  } else if (lowercaseDish.includes('curry')) {
    searchTerms.push('curry dish');
  } else if (lowercaseDish.includes('sandwich')) {
    searchTerms.push('gourmet sandwich');
  } else if (lowercaseDish.includes('steak')) {
    searchTerms.push('steak dish');
  } else if (lowercaseDish.includes('chicken')) {
    searchTerms.push('chicken dish');
  } else if (lowercaseDish.includes('fish') || lowercaseDish.includes('seafood')) {
    searchTerms.push('seafood dish');
  } else if (lowercaseDish.includes('breakfast')) {
    searchTerms.push('breakfast plate');
  } else if (lowercaseDish.includes('noodle')) {
    searchTerms.push('noodle dish');
  }
  
  // Always include "food" to improve results
  searchTerms.push('food');
  
  // Add specific cuisine types if detected
  if (lowercaseDish.includes('italian') || lowercaseCuisine.includes('italian')) {
    searchTerms.push('italian cuisine');
  } else if (lowercaseDish.includes('mexican') || lowercaseCuisine.includes('mexican')) {
    searchTerms.push('mexican cuisine');
  } else if (lowercaseDish.includes('indian') || lowercaseCuisine.includes('indian')) {
    searchTerms.push('indian cuisine');
  } else if (lowercaseDish.includes('chinese') || lowercaseCuisine.includes('chinese')) {
    searchTerms.push('chinese cuisine');
  } else if (lowercaseDish.includes('japanese') || lowercaseCuisine.includes('japanese')) {
    searchTerms.push('japanese cuisine');
  } else if (lowercaseDish.includes('thai') || lowercaseCuisine.includes('thai')) {
    searchTerms.push('thai cuisine');
  }
  
  // Add "high quality" and "food photography" to improve results
  searchTerms.push('food photography');
  
  // Join terms with spaces for the final query
  return searchTerms.join(' ').trim();
}

/**
 * Extract a cuisine type from a restaurant name
 * Used to improve search queries when a restaurant name is provided
 * @param restaurantName The name of the restaurant
 * @returns The extracted cuisine type or the original restaurant name
 */
export function extractCuisineFromRestaurant(restaurantName: string): string {
  const lowercaseName = restaurantName.toLowerCase();
  
  // Look for common cuisine indicators in the name
  if (lowercaseName.includes('italian') || lowercaseName.includes('pasta') || lowercaseName.includes('pizza')) {
    return 'Italian';
  } else if (lowercaseName.includes('mexican') || lowercaseName.includes('taco') || lowercaseName.includes('burrito')) {
    return 'Mexican';
  } else if (lowercaseName.includes('chinese') || lowercaseName.includes('wok') || lowercaseName.includes('dragon')) {
    return 'Chinese';
  } else if (lowercaseName.includes('indian') || lowercaseName.includes('curry') || lowercaseName.includes('spice')) {
    return 'Indian';
  } else if (lowercaseName.includes('thai') || lowercaseName.includes('bangkok')) {
    return 'Thai';
  } else if (lowercaseName.includes('sushi') || lowercaseName.includes('japanese') || lowercaseName.includes('tokyo')) {
    return 'Japanese';
  } else if (lowercaseName.includes('french') || lowercaseName.includes('paris') || lowercaseName.includes('bistro')) {
    return 'French';
  } else if (lowercaseName.includes('greek') || lowercaseName.includes('mediterranean')) {
    return 'Mediterranean';
  } else if (lowercaseName.includes('american') || lowercaseName.includes('burger') || lowercaseName.includes('grill')) {
    return 'American';
  }
  
  // Return original if no match
  return restaurantName;
}

export default unsplash;