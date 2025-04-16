import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { foodItems, type FoodItem } from "../shared/schema";
import { db } from "./db";
import { analyzeMoodAndPreferences } from "./services/openai";
import { analyzeComplexFoodRequest, scoreItemsBasedOnAnalysis } from "./services/nlp";
import { buildFoodSearchQuery, fetchImageUrls, fetchRandomFoodImage } from "./services/unsplash";
import { 
  fetchRandomFoodImage as fetchFoodishImage,
  fetchFoodImageByCategory,
  getAvailableFoodCategories
} from "./services/foodish";
import { enrichFoodItemWithNutrition } from "./services/nutrition";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // API route for health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MoodBite API is running' });
  });

  // Get all food items with cache control
  app.get('/api/food-items', async (req, res) => {
    try {
      // Set cache control headers to prevent client-side caching
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // Get all food items from storage
      let items = await storage.getAllFoodItems();
      
      // Add nutritional information to each food item
      items = items.map(item => enrichFoodItemWithNutrition(item));
      
      // Randomize the order of items to provide variety
      // This ensures different items appear in different searches
      if (items && items.length > 0) {
        // Add randomization based on timestamp if present in query
        if (req.query.t) {
          // Use the timestamp as a seed for randomization
          const timestamp = parseInt(req.query.t as string);
          const random = req.query.r ? parseInt(req.query.r as string) : Math.floor(Math.random() * 10000);
          
          // Create a simple but effective randomization using timestamp + random as seed
          items = items.sort(() => {
            return 0.5 - Math.sin(timestamp + random);
          });
          
          // Log the randomization for debugging
          console.log(`Randomized food items using timestamp: ${timestamp}, random: ${random}`);
        } else {
          // Simple shuffle if no timestamp provided
          items = items.sort(() => 0.5 - Math.random());
        }
        
        // Check if we should refresh images using Unsplash API
        const refreshImages = req.query.refresh_images === 'true';
        
        // Only attempt to refresh images if the Unsplash API key is provided
        if (refreshImages && process.env.UNSPLASH_ACCESS_KEY) {
          // Refresh images for the first few items (to avoid exceeding rate limits)
          const MAX_REFRESH_COUNT = 5;
          const itemsToRefresh = Math.min(items.length, MAX_REFRESH_COUNT);
          
          console.log(`Refreshing images for ${itemsToRefresh} food items using Unsplash API`);
          
          // Create a fresh array with potentially new images
          const refreshedItems = [...items];
          
          // Add randomization to the query for more varied results
          const timestamp = Date.now();
          const randomNum = Math.floor(Math.random() * 10000);
          
          // Create an array of extra terms to add variety
          const extraTerms = [
            'delicious', 'gourmet', 'tasty', 'fresh', 'homemade', 
            'restaurant quality', 'cuisine', 'culinary', 'meal',
            'professional photo', 'food photography', 'appetizing'
          ];
          
          // Use Promise.all to refresh images in parallel
          await Promise.all(
            refreshedItems.slice(0, itemsToRefresh).map(async (item, index) => {
              try {
                // Build a custom search query using dish characteristics
                const baseQuery = buildFoodSearchQuery(item.dishName, item.restaurant);
                
                // Add random extra terms for more variety
                const extraTerm1 = extraTerms[(timestamp + index) % extraTerms.length];
                const extraTerm2 = extraTerms[(randomNum + index) % extraTerms.length];
                const searchQuery = `${baseQuery} ${extraTerm1} ${extraTerm2}`;
                
                // Add timestamp to log to track different attempts
                console.log(`Using random image from Unsplash for: "${searchQuery}" - Photo by Unsplash photographer`);
                
                // Fetch a new image from Unsplash
                const imageUrl = await fetchRandomFoodImage(searchQuery);
                
                // Update the item if we got a new image
                if (imageUrl) {
                  refreshedItems[index] = {
                    ...item,
                    image: imageUrl
                  };
                }
              } catch (imageError) {
                console.error(`Failed to refresh image for item ${item.id}:`, imageError);
                // Keep original image on error
              }
            })
          );
          
          // Return the refreshed items
          return res.json(refreshedItems);
        }
      }
      
      // Return the regular items if no refresh was requested
      res.json(items);
    } catch (error) {
      console.error('Error fetching food items:', error);
      res.status(500).json({ error: 'Failed to fetch food items' });
    }
  });

  // Get a specific food item by ID with cache control
  app.get('/api/food-items/:id', async (req, res) => {
    try {
      // Set cache control headers to prevent client-side caching
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const item = await storage.getFoodItemById(id);
      if (!item) {
        return res.status(404).json({ error: 'Food item not found' });
      }

      // Check if the request includes a fresh parameter to fetch a new image
      const refreshImage = req.query.refresh === 'true';
      
      if (refreshImage && process.env.UNSPLASH_ACCESS_KEY) {
        try {
          // Build a query using dish name and characteristics
          const searchQuery = buildFoodSearchQuery(item.dishName, item.restaurant);
          
          // Fetch a fresh image from Unsplash
          const imageUrl = await fetchRandomFoodImage(searchQuery);
          
          if (imageUrl) {
            // Return the item with the fresh image
            return res.json({
              ...item,
              image: imageUrl
            });
          }
        } catch (imageError) {
          console.error('Failed to fetch fresh image:', imageError);
          // Continue with original image if fetch fails
        }
      }

      res.json(item);
    } catch (error) {
      console.error('Error fetching food item:', error);
      res.status(500).json({ error: 'Failed to fetch food item' });
    }
  });
  
  // Get a fresh food image from Unsplash
  app.get('/api/food-image', async (req, res) => {
    try {
      const { query, count } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }
      
      // Enhanced collection of reliable fallback food images
      const fallbackImages = [
        // Colorful food spread (popular)
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        // Burger
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
        // Pizza
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", 
        // Vegetable salad
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
        // Dessert/cake
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
        // Fancy dinner
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        // Breakfast
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
        // Pasta
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
        // Asian food
        "https://images.unsplash.com/photo-1562436302-4a28868bdb8f",
        // Mexican food
        "https://images.unsplash.com/photo-1583033974607-323724061347",
        // Seafood
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327"
      ];
      
      // Category-specific fallback images
      const categoryFallbacks: Record<string, string[]> = {
        'veg': [
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
          "https://images.unsplash.com/photo-1547496502-affa22d38842"
        ],
        'nonVeg': [
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
          "https://images.unsplash.com/photo-1558030006-450675393462",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
        ],
        'dessert': [
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
          "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94",
          "https://images.unsplash.com/photo-1488477304112-4944851de03d"
        ]
      };
      
      // Set cache control headers to prevent browser caching
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      // Parse count parameter if present
      const imageCount = count ? parseInt(count as string) : 1;
      
      // Get food categories from query if present
      const lowerQuery = query.toLowerCase();
      let categorySpecificFallbacks: string[] = [];
      
      // Match query to food categories for better fallbacks
      if (lowerQuery.includes('veg') && !lowerQuery.includes('non')) {
        categorySpecificFallbacks = categoryFallbacks.veg;
      } else if (lowerQuery.includes('non') && lowerQuery.includes('veg')) {
        categorySpecificFallbacks = categoryFallbacks.nonVeg;
      } else if (lowerQuery.includes('dessert') || lowerQuery.includes('cake') || lowerQuery.includes('sweet')) {
        categorySpecificFallbacks = categoryFallbacks.dessert;
      }
      
      // Try using Foodish API as the primary image source
      try {
        console.log(`Using Foodish API as primary source for query: "${query}"`);
        
        // Extract food category name from the query to try category-specific search
        const words = query.split(/[\s,]+/);
        let mainDishType = '';
        
        // Look for main dish name in the first few words
        for (let i = 0; i < Math.min(3, words.length); i++) {
          if (words[i].length > 3) { // Skip short words
            mainDishType = words[i];
            break;
          }
        }
        
        // Array to store Foodish results
        const foodishResults = [];
        
        // Try to get images for the specific food category or random if that fails
        for (let i = 0; i < imageCount; i++) {
          let foodishUrl;
          
          if (mainDishType) {
            // Try category-specific fetch first
            foodishUrl = await fetchFoodImageByCategory(mainDishType);
          }
          
          // If category search fails or no category, get a random image
          if (!foodishUrl) {
            foodishUrl = await fetchFoodishImage();
          }
          
          if (foodishUrl) {
            foodishResults.push(foodishUrl);
          }
        }
        
        // If we got all the images we needed from Foodish, return them
        if (foodishResults.length === imageCount) {
          console.log(`Successfully used Foodish API for query: "${query}"`);
          return res.json({ images: foodishResults, source: 'foodish' });
        }
        
        // If we didn't get enough images from Foodish, try Unsplash as fallback
        if (process.env.UNSPLASH_ACCESS_KEY) {
          try {
            // Fetch images from Unsplash
            const unsplashImages = await fetchImageUrls(query, imageCount - foodishResults.length);
            
            // Return combined images if found
            if (unsplashImages && unsplashImages.length > 0) {
              const combinedImages = [...foodishResults, ...unsplashImages];
              return res.json({ images: combinedImages, source: 'mixed' });
            }
          } catch (apiError) {
            console.error('Unsplash API error:', apiError);
            // Continue to fallback logic if Unsplash fails
          }
        }
        
        // If we got some but not all images from Foodish and Unsplash failed too, 
        // fill the rest with static fallbacks
        if (foodishResults.length > 0) {
          console.log(`Got ${foodishResults.length}/${imageCount} images from Foodish API, filling the rest with fallbacks`);
          
          // Create timestamp for randomization and cache-busting
          const timestamp = Date.now();
          const randomSeed = Math.floor(Math.random() * 10000);
          
          // Use query to deterministically select images
          const queryHash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          
          // Choose which fallback collection to use - category-specific or general
          const fallbackCollection = categorySpecificFallbacks.length > 0 ? 
            [...categorySpecificFallbacks, ...fallbackImages] : fallbackImages;
          
          // How many more images we need
          const remainingCount = imageCount - foodishResults.length;
          
          // Generate the remaining fallback images
          for (let i = 0; i < remainingCount; i++) {
            // Calculate index using multiple factors for better distribution
            const index = (queryHash + i + timestamp % 1000) % fallbackCollection.length;
            // Add cache-busting parameters
            const cacheBuster = `?t=${timestamp}-${randomSeed}-${i}`;
            foodishResults.push(`${fallbackCollection[index]}${cacheBuster}`);
          }
          
          return res.json({ images: foodishResults, source: 'mixed' });
        }
      } catch (foodishError) {
        console.error('Error using Foodish API:', foodishError);
        
        // Try Unsplash as a fallback
        if (process.env.UNSPLASH_ACCESS_KEY) {
          try {
            // Fetch images from Unsplash
            const images = await fetchImageUrls(query, imageCount);
            
            // Return images if found
            if (images && images.length > 0) {
              return res.json({ images, source: 'unsplash' });
            }
          } catch (apiError) {
            console.error('Unsplash API error:', apiError);
            // Continue to fallback logic
          }
        }
      }
      
      // If we get here, either the API key isn't configured, 
      // the API call failed, or no images were found
      
      // Try using Foodish API as an alternative image source
      try {
        console.log(`Trying Foodish API for query: "${query}"`);
        
        // Extract food category name from the query to try category-specific search
        const words = query.split(/[\s,]+/);
        let mainDishType = '';
        
        // Look for main dish name in the first few words
        for (let i = 0; i < Math.min(3, words.length); i++) {
          if (words[i].length > 3) { // Skip short words
            mainDishType = words[i];
            break;
          }
        }
        
        // Array to store Foodish results
        const foodishResults = [];
        
        // Try to get images for the specific food category or random if that fails
        for (let i = 0; i < imageCount; i++) {
          let foodishUrl;
          
          if (mainDishType) {
            // Try category-specific fetch first
            foodishUrl = await fetchFoodImageByCategory(mainDishType);
          }
          
          // If category search fails or no category, get a random image
          if (!foodishUrl) {
            foodishUrl = await fetchFoodishImage();
          }
          
          if (foodishUrl) {
            foodishResults.push(foodishUrl);
          }
        }
        
        // If we got all the images we needed from Foodish, return them
        if (foodishResults.length === imageCount) {
          console.log(`Successfully used Foodish API for query: "${query}"`);
          return res.json({ images: foodishResults });
        }
        
        // If we got some but not all images, fill the rest with static fallbacks
        if (foodishResults.length > 0) {
          console.log(`Got ${foodishResults.length}/${imageCount} images from Foodish API, filling the rest with fallbacks`);
          
          // Create timestamp for randomization and cache-busting
          const timestamp = Date.now();
          const randomSeed = Math.floor(Math.random() * 10000);
          
          // Use query to deterministically select images
          const queryHash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          
          // Choose which fallback collection to use - category-specific or general
          const fallbackCollection = categorySpecificFallbacks.length > 0 ? 
            [...categorySpecificFallbacks, ...fallbackImages] : fallbackImages;
          
          // How many more images we need
          const remainingCount = imageCount - foodishResults.length;
          
          // Generate the remaining fallback images
          for (let i = 0; i < remainingCount; i++) {
            // Calculate index using multiple factors for better distribution
            const index = (queryHash + i + timestamp % 1000) % fallbackCollection.length;
            // Add cache-busting parameters
            const cacheBuster = `?t=${timestamp}-${randomSeed}-${i}`;
            foodishResults.push(`${fallbackCollection[index]}${cacheBuster}`);
          }
          
          return res.json({ images: foodishResults });
        }
      } catch (foodishError) {
        console.error('Error using Foodish API:', foodishError);
        // Continue to static fallback images
      }
      
      // If Foodish API failed completely, use static fallback images
      // Create timestamp for randomization and cache-busting
      const timestamp = Date.now();
      const randomSeed = Math.floor(Math.random() * 10000);
      
      // Use query to deterministically select images
      // This ensures same query gets same image within a time window
      const queryHash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Choose which fallback collection to use - category-specific or general
      const fallbackCollection = categorySpecificFallbacks.length > 0 ? 
        [...categorySpecificFallbacks, ...fallbackImages] : fallbackImages;
      
      // Generate fallback images with cache-busting parameters
      const fallbackResults = [];
      for (let i = 0; i < imageCount; i++) {
        // Calculate index using multiple factors for better distribution
        const index = (queryHash + i + timestamp % 1000) % fallbackCollection.length;
        // Add cache-busting parameters
        const cacheBuster = `?t=${timestamp}-${randomSeed}-${i}`;
        fallbackResults.push(`${fallbackCollection[index]}${cacheBuster}`);
      }
      
      console.log(`Using static fallback images for query: "${query}"`);
      res.json({ images: fallbackResults });
    } catch (error) {
      console.error('Critical error in image API:', error);
      
      // Last resort fallback - always return at least one image
      const timestamp = Date.now();
      const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?fallback=" + timestamp;
      res.json({ images: [fallbackImg] });
    }
  });

  // Route to seed the database with initial food items data (admin only)
  app.post('/api/seed-database', async (req, res) => {
    try {
      // Check if database is already seeded
      const existingItems = await db.select().from(foodItems);
      
      if (existingItems.length > 0) {
        return res.json({ 
          message: `Database already contains ${existingItems.length} food items. No action taken.`,
          seeded: false
        });
      }

      // If we need to seed data, import from our scripts
      const { seedDatabase } = await import('../scripts/migrate.js');
      await seedDatabase();
      
      res.json({ 
        message: 'Database seeded successfully!',
        seeded: true
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).json({ error: 'Failed to seed database' });
    }
  });
  
  // Route to generate 300 food items
  app.post('/api/generate-food-items', async (req, res) => {
    try {
      const { count = 300 } = req.body;
      const { generateFoodItems } = await import('../scripts/generate-food-items.js');
      const result = await generateFoodItems(count);
      
      if (result.success) {
        res.json({ 
          message: `Successfully generated ${result.count} food items!`,
          count: result.count
        });
      } else {
        throw new Error('Food item generation failed: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating food items:', error);
      res.status(500).json({ error: 'Failed to generate food items' });
    }
  });
  
  // Simple endpoint to get information about available image sources
  app.get('/api/image-sources', (req, res) => {
    // Get food categories directly from our local collection
    const foodCategories = [
      'pizza', 'burger', 'pasta', 'rice', 'dessert', 
      'salad', 'curry', 'soup', 'chicken', 'general'
    ];
    
    const sources = [
      {
        name: 'Foodish',
        url: 'https://foodish.cf', // Updated URL
        description: 'Curated food images with various categories',
        status: 'available',
        rateLimit: 'unlimited',
        attribution: 'Food images collection',
        isPrimary: true,
        categories: foodCategories,
        info: 'Local implementation with category detection'
      },
      {
        name: 'Unsplash',
        url: 'https://unsplash.com',
        description: 'High-quality free photos from professional photographers',
        status: process.env.UNSPLASH_ACCESS_KEY ? 'configured' : 'not configured',
        rateLimit: '50 requests per hour',
        attribution: 'Photos by Unsplash photographers',
        isPrimary: false
      }
    ];
    
    res.json(sources);
  });
  
  // Test image APIs connection (both Unsplash and Foodish)
  app.get('/api/test-unsplash', async (req, res) => {
    try {
      const results: Record<string, any> = {
        apiKey: Boolean(process.env.UNSPLASH_ACCESS_KEY),
        keyLength: process.env.UNSPLASH_ACCESS_KEY ? process.env.UNSPLASH_ACCESS_KEY.length : 0
      };
      
      // Test direct fetch to Unsplash API
      if (process.env.UNSPLASH_ACCESS_KEY) {
        try {
          const headers = {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            'Accept-Version': 'v1'
          };
          
          // Log headers for debugging
          console.log('Testing Unsplash with headers:', headers);
          
          const response = await fetch('https://api.unsplash.com/photos?per_page=1', { 
            headers,
            method: 'GET'
          });
          
          results.status = response.status;
          results.statusText = response.statusText;
          
          // Get rate limit info from headers
          results.rateLimit = {
            limit: response.headers.get('X-Ratelimit-Limit'),
            remaining: response.headers.get('X-Ratelimit-Remaining')
          };
          
          if (response.ok) {
            try {
              const data = await response.json();
              results.success = true;
              results.responseType = typeof data;
              results.isArray = Array.isArray(data);
              results.length = Array.isArray(data) ? data.length : 0;
            } catch (parseError: any) {
              results.success = false;
              results.parseError = parseError?.message || 'JSON parsing error';
              results.rawResponse = await response.text();
            }
          } else {
            results.success = false;
            try {
              results.errorBody = await response.json();
            } catch (e) {
              results.errorText = await response.text();
            }
          }
        } catch (fetchError: any) {
          results.success = false;
          results.error = fetchError?.message || 'Fetch error';
        }
      }
      
      // Also try the standard unsplash-js library
      try {
        if (process.env.UNSPLASH_ACCESS_KEY) {
          const result = await fetchImageUrls('test food photo', 1);
          results.librarySuccess = Boolean(result && result.length > 0);
          results.libraryResults = result || null;
        } else {
          results.librarySuccess = false;
          results.libraryError = 'No API key available';
        }
      } catch (libraryError: any) {
        results.librarySuccess = false;
        results.libraryError = libraryError?.message || 'Unknown error';
      }
      
      // Test Foodish API connection
      try {
        console.log('Testing Foodish API connection...');
        
        // Test both random image and category-specific endpoints
        const randomImagePromise = fetchFoodishImage();
        const categoryImagePromise = fetchFoodImageByCategory('pizza');
        
        const [randomImage, categoryImage] = await Promise.all([
          randomImagePromise,
          categoryImagePromise
        ]);
        
        // Add Foodish results to the response
        results.foodish = {
          success: Boolean(randomImage),
          categorySuccess: Boolean(categoryImage),
          randomImageUrl: randomImage ? randomImage.split('?')[0] : null,
          categoryImageUrl: categoryImage ? categoryImage.split('?')[0] : null
        };
      } catch (foodishError: any) {
        console.error('Foodish API test failed:', foodishError);
        
        // Still include Foodish info in results, but mark as failed
        results.foodish = {
          success: false,
          error: foodishError?.message || 'Unknown error',
        };
      }
      
      res.json(results);
    } catch (error) {
      console.error('API test failed:', error);
      res.status(500).json({ error: 'Failed to test image API connections' });
    }
  });
  
  // Analyze voice input for mood and preferences using NLP
  app.post('/api/analyze-mood', async (req, res) => {
    try {
      const { text, timestamp } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text input is required' });
      }
      
      // Log the request with timestamp for debugging
      console.log(`Analyzing mood for: "${text}" (timestamp: ${timestamp || 'none'})`);
      
      // Analyze the text using OpenAI
      const analysis = await analyzeMoodAndPreferences(text);
      
      // Get filtered food items based on analysis
      const items = await storage.getAllFoodItems();
      let filteredItems = [...items];
      
      // Apply dietary filters
      if (analysis.dietary.isVeg) {
        filteredItems = filteredItems.filter(item => item.category === 'veg');
      } else if (analysis.dietary.isEgg) {
        filteredItems = filteredItems.filter(item => item.category === 'egg');
      } else if (analysis.dietary.isNonVeg) {
        filteredItems = filteredItems.filter(item => item.category === 'nonVeg');
      }
      
      // Apply sorting
      if (analysis.sortPreference === 'Rating') {
        filteredItems.sort((a, b) => b.rating - a.rating);
      } else if (analysis.sortPreference === 'DeliveryTime') {
        filteredItems.sort((a, b) => parseInt(a.eta) - parseInt(b.eta));
      }
      
      // Add more variety based on mood and food suggestions
      // Create a scoring system for items based on mood and suggestions
      const moodLower = analysis.mood.toLowerCase();
      const foodSuggestionsLower = analysis.foodSuggestions.map(s => s.toLowerCase());
      
      // Log that we're randomizing items based on mood and timestamp
      console.log(`Randomizing food items using timestamp: ${timestamp}, mood: ${analysis.mood}`);
        
      // Apply different randomization strategies based on mood
      // This ensures different moods show very different food orders
      
      // First, apply a pre-shuffle based on the detected mood
      const moodSeed = moodLower.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const random = Math.floor(Math.random() * 10000);
      console.log(`Randomized food items using timestamp: ${timestamp}, random: ${random}`);
      
      // Shuffle the entire array first based on mood
      const shuffleFactor = timestamp ? (timestamp % 10000) : moodSeed;
      
      // Use mood-based shuffling - different moods will result in different sort orders
      filteredItems.sort(() => {
        // Create a deterministic but different ordering for each mood
        return 0.5 - Math.sin(shuffleFactor * moodSeed / 1000);
      });
      
      // Create scores for each food item
      const scoredItems = filteredItems.map((item, index) => {
        let score = 0;
        const itemNameLower = item.dishName.toLowerCase();
        const restaurantLower = item.restaurant.toLowerCase();
        
        // Give a different base score based on the item's position after mood shuffling
        // This ensures different moods have very different base ordering
        score += (filteredItems.length - index) * (moodSeed % 5);
        
        // Score based on mood matching
        // Happy mood favors highly-rated foods
        if (moodLower.includes('happy') || moodLower.includes('excited')) {
          score += item.rating * 2;
        } 
        // Sad mood favors comfort foods (higher prices often = comfort foods)
        else if (moodLower.includes('sad') || moodLower.includes('depressed')) {
          score += parseInt(item.price.replace('$', '')) * 2;
        }
        // Stressed/rushed mood favors quick delivery
        else if (moodLower.includes('stressed') || moodLower.includes('busy') || moodLower.includes('hurry')) {
          score += (30 - parseInt(item.eta)) * 3;
        }
        
        // Check if item matches any food suggestions
        for (const suggestion of foodSuggestionsLower) {
          if (itemNameLower.includes(suggestion) || restaurantLower.includes(suggestion)) {
            score += 10; // Big boost for direct matches
          }
          
          // Handle common categories
          if ((suggestion.includes('spicy') && itemNameLower.includes('spicy')) ||
              (suggestion.includes('sweet') && itemNameLower.includes('sweet')) ||
              (suggestion.includes('dessert') && (item.category === 'dessert' || itemNameLower.includes('cake') || itemNameLower.includes('ice cream'))) ||
              (suggestion.includes('pizza') && itemNameLower.includes('pizza')) ||
              (suggestion.includes('burger') && itemNameLower.includes('burger')) ||
              (suggestion.includes('salad') && itemNameLower.includes('salad')) ||
              (suggestion.includes('soup') && itemNameLower.includes('soup')) ||
              (suggestion.includes('noodle') && itemNameLower.includes('noodle')) ||
              (suggestion.includes('pasta') && itemNameLower.includes('pasta')) ||
              (suggestion.includes('rice') && itemNameLower.includes('rice')) ||
              (suggestion.includes('sandwich') && itemNameLower.includes('sandwich'))) {
            score += 8;
          }
        }
        
        // Add significant randomness to ensure different results on each query
        // Increased from 25 to 35 to make randomness even more impactful
        score += Math.random() * 35;
        
        // Also add timestamp-based randomization if available
        if (timestamp) {
          // Use the timestamp to add more variation
          // Create a unique factor based on timestamp and item properties
          const idFactor = (item.id % 100) / 100;
          const priceFactor = parseInt(item.price.replace('$', '')) / 10;
          const timestampFactor = (timestamp % 10000) / 10000;
          
          // Combine multiple factors for better distribution
          const combinedFactor = (idFactor + priceFactor + timestampFactor) * 25;
          
          // Add a random adjustment based on timestamp
          score += combinedFactor;
        }
        
        return { ...item, score };
      });
      
      // First sort by score
      scoredItems.sort((a, b) => b.score - a.score);
      
      // Group items with similar scores and shuffle those groups
      // This ensures that items with similar relevance can appear in different orders
      const groupedItems: FoodItem[][] = [];
      let currentGroup: FoodItem[] = [];
      let currentScore: number | null = null;
      
      scoredItems.forEach(item => {
        const score = (item as any).score;
        
        if (currentScore === null) {
          currentScore = score;
          currentGroup.push(item);
        } else if (Math.abs(score - currentScore) <= 5) { // Items with scores within 5 points of each other
          currentGroup.push(item);
        } else {
          // Shuffle the current group
          for (let i = currentGroup.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
          }
          
          groupedItems.push([...currentGroup]);
          currentGroup = [item];
          currentScore = score;
        }
      });
      
      // Don't forget the last group
      if (currentGroup.length > 0) {
        // Shuffle the last group
        for (let i = currentGroup.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [currentGroup[i], currentGroup[j]] = [currentGroup[j], currentGroup[i]];
        }
        
        groupedItems.push([...currentGroup]);
      }
      
      // Flatten the grouped items back into a single array
      const shuffledItems = groupedItems.flat();
      
      // Remove the score before sending the response
      const finalItems = shuffledItems.map((item) => {
        // Create a new object without the score property
        const { score, ...rest } = item as any;
        return rest;
      });
      
      // Log for debugging
      console.log(`User input: "${text}", detected mood: ${analysis.mood}, suggestions: ${analysis.foodSuggestions.join(', ')}`);
      
      res.json({
        mood: analysis.mood,
        foodSuggestions: analysis.foodSuggestions,
        dietary: analysis.dietary,
        sortPreference: analysis.sortPreference,
        filteredItems: finalItems
      });
    } catch (error) {
      console.error('Error analyzing mood:', error);
      res.status(500).json({ error: 'Failed to analyze mood' });
    }
  });

  // Advanced NLP for complex food requests
  app.post('/api/advanced-food-request', async (req, res) => {
    try {
      const { text, timestamp } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text input is required' });
      }
      
      // Log the request with timestamp for debugging
      console.log(`Advanced food request for: "${text}" (timestamp: ${timestamp || 'none'})`);
      
      // First perform the regular mood analysis
      const moodAnalysis = await analyzeMoodAndPreferences(text);
      
      // Then perform the advanced NLP analysis for complex food requests
      const complexAnalysis = await analyzeComplexFoodRequest(text);
      
      // Get all food items
      const items = await storage.getAllFoodItems();
      
      // Apply basic dietary filters from the mood analysis
      let filteredItems = [...items];
      if (moodAnalysis.dietary.isVeg) {
        filteredItems = filteredItems.filter(item => item.category === 'veg');
      } else if (moodAnalysis.dietary.isEgg) {
        filteredItems = filteredItems.filter(item => item.category === 'egg');
      } else if (moodAnalysis.dietary.isNonVeg) {
        filteredItems = filteredItems.filter(item => item.category === 'nonVeg');
      }
      
      // Score and sort items based on the complex analysis
      // Pass timestamp to enhance randomization
      const scoredItems = scoreItemsBasedOnAnalysis(filteredItems, complexAnalysis, timestamp);
      
      // Log for debugging
      console.log(`Advanced NLP request: "${text}", mood: ${moodAnalysis.mood}, keywords: ${complexAnalysis.keywords.join(', ')}`);
      
      res.json({
        mood: moodAnalysis.mood,
        foodSuggestions: moodAnalysis.foodSuggestions,
        complexAnalysis: complexAnalysis,
        filteredItems: scoredItems
      });
    } catch (error) {
      console.error('Error processing advanced food request:', error);
      res.status(500).json({ error: 'Failed to process food request' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
