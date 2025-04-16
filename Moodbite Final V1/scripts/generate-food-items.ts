import { db } from '../server/db';
import { foodItems } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Cuisine types for variation
const cuisines = [
  'Italian', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Japanese', 'Greek', 'French', 
  'American', 'Mediterranean', 'Korean', 'Vietnamese', 'Turkish', 'Lebanese', 'Spanish',
  'Brazilian', 'Peruvian', 'Moroccan', 'Ethiopian', 'Caribbean'
];

// Dish name prefixes for variety
const dishPrefixes = [
  'Spicy', 'Creamy', 'Grilled', 'Roasted', 'Fried', 'Steamed', 'Baked', 'Fresh', 'Smoked', 
  'Stir-fried', 'Slow-cooked', 'Pan-fried', 'Broiled', 'Stewed', 'Braised', 'Poached', 
  'Sautéed', 'Traditional', 'Homemade', 'Gourmet'
];

// Dish types for diversity
const dishTypes = [
  'Pizza', 'Pasta', 'Burger', 'Curry', 'Salad', 'Soup', 'Sandwich', 'Bowl', 'Wrap', 
  'Steak', 'Noodles', 'Rice', 'Tacos', 'Burritos', 'Dumplings', 'Sushi', 'Roll', 
  'Biryani', 'Kebab', 'Ramen', 'Lasagna', 'Risotto', 'Falafel', 'Quesadilla',
  'Ice Cream', 'Cake', 'Pie', 'Cookies', 'Brownies', 'Pastry', 'Donut', 'Pudding',
  'Mochi', 'Cheesecake', 'Tiramisu', 'Custard', 'Mousse', 'Tart', 'Parfait', 'Gelato'
];

// Flavor descriptors
const flavors = [
  'Sweet', 'Spicy', 'Tangy', 'Savory', 'Rich', 'Mild', 'Hot', 'Zesty', 'Bitter', 
  'Smoky', 'Sour', 'Garlicky', 'Herbal', 'Citrusy', 'Earthy', 'Buttery', 'Crispy',
  'Cheesy', 'Fruity', 'Chocolatey'
];

// Food proteins/ingredients
const proteins = [
  'Chicken', 'Beef', 'Pork', 'Fish', 'Lamb', 'Shrimp', 'Turkey', 'Duck', 'Tofu', 
  'Beans', 'Lentils', 'Chickpeas', 'Egg', 'Paneer', 'Tempeh', 'Seitan', 
  'Quinoa', 'Mushroom', 'Falafel', 'Cheese'
];

// Restaurant names
const restaurantPrefixes = [
  'Golden', 'Royal', 'Blue', 'Green', 'Red', 'Silver', 'Jade', 'Ruby', 'Emerald',
  'Sunshine', 'Happy', 'Lucky', 'Star', 'Moon', 'Ocean', 'Mountain', 'Garden',
  'Village', 'City', 'Metro'
];

const restaurantTypes = [
  'Kitchen', 'Bistro', 'Café', 'Grill', 'Diner', 'Restaurant', 'Eatery', 'Bar',
  'Tavern', 'House', 'Palace', 'Garden', 'Corner', 'Express', 'Delight',
  'Bites', 'Feast', 'Treats', 'Flavors', 'Table'
];

// Category types for filtering
const categories = ['veg', 'nonVeg', 'egg'];

// Delivery times (in minutes)
const deliveryTimes = ['15', '20', '25', '30', '35', '40', '45', '50'];

// Price ranges in Indian Rupees (₹150 to ₹850)
const prices = ['₹150', '₹199', '₹249', '₹299', '₹349', '₹399', '₹449', '₹499', '₹549', '₹599', '₹649', '₹699', '₹749', '₹799', '₹849'];

// We're using dynamic Unsplash image generation instead of fixed URLs

// Rating values with appropriate distribution
const ratings = [
  3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9,
  4.0, 4.0, 4.1, 4.1, 4.2, 4.2, 4.2, 4.3, 4.3, 4.3, 4.4, 4.4, 4.4, 4.5, 4.5, 4.5, 4.5,
  4.6, 4.6, 4.6, 4.7, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9, 5.0
];

// Helper functions
const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const getRandomRating = (): number => getRandomItem(ratings);

// Generate a randomized food item
function generateRandomFoodItem(id: number) {
  const cuisine = getRandomItem(cuisines);
  const prefix = getRandomItem(dishPrefixes);
  const dishType = getRandomItem(dishTypes);
  const protein = getRandomItem(proteins);
  const flavor = getRandomItem(flavors);
  
  // Generate dish name with some variation patterns
  let dishName = '';
  const pattern = Math.floor(Math.random() * 5);
  
  switch (pattern) {
    case 0:
      dishName = `${prefix} ${protein} ${dishType}`;
      break;
    case 1:
      dishName = `${cuisine} ${dishType} with ${protein}`;
      break;
    case 2:
      dishName = `${prefix} ${cuisine} ${dishType}`;
      break;
    case 3:
      dishName = `${protein} & ${flavor} ${dishType}`;
      break;
    case 4:
      dishName = `${cuisine}-style ${protein} ${dishType}`;
      break;
    default:
      dishName = `${prefix} ${dishType}`;
  }
  
  // Generate restaurant name
  const restaurantName = `${getRandomItem(restaurantPrefixes)} ${getRandomItem(restaurantTypes)}`;
  
  // Assign category with better logic
  let category;
  if (dishName.toLowerCase().includes('tofu') || 
      dishName.toLowerCase().includes('vegan') || 
      dishName.toLowerCase().includes('vegetable') || 
      dishName.toLowerCase().includes('salad')) {
    category = 'veg';
  } else if (dishName.toLowerCase().includes('egg') || 
             dishName.toLowerCase().includes('omelet')) {
    category = 'egg';
  } else {
    // For dishes with meat proteins, assign nonVeg
    if (['Chicken', 'Beef', 'Pork', 'Fish', 'Lamb', 'Shrimp', 'Turkey', 'Duck']
        .some(meat => dishName.includes(meat))) {
      category = 'nonVeg';
    } else {
      // Assign randomly for others
      category = getRandomItem(categories);
    }
  }
  
  // Do not use dynamic imports here - just generate placeholder URLs
  
  // Generate a placeholder image URL for initial database seeding
  // Will be replaced by real API calls in the API route
  const generatePlaceholderImageUrl = (dishName: string, cuisine: string): string => {
    // Build a reasonable search query based on the dish characteristics
    const searchQuery = encodeURIComponent(dishName.replace(/&/g, 'and'));
    const cuisineParam = encodeURIComponent(cuisine);
    
    // Use the standard Unsplash featured image endpoint with multiple keywords for better relevance
    return `https://source.unsplash.com/featured/?${searchQuery},${cuisineParam},food`;
  };
  
  // Generate a placeholder URL for initial seeding
  // Later we'll fetch real images using the API in the food-items route
  const selectedImage = generatePlaceholderImageUrl(dishName, cuisine);
  
  return {
    id,
    dishName,
    restaurant: restaurantName,
    category,
    eta: getRandomItem(deliveryTimes),
    rating: getRandomRating(),
    price: getRandomItem(prices),
    image: selectedImage
  };
}

// Main function to generate and insert food items
export async function generateFoodItems(count: number = 300) {
  try {
    // Clear existing food items
    await db.delete(foodItems);
    console.log('Cleared existing food items');
    
    // Generate new food items
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push(generateRandomFoodItem(i));
    }
    
    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await db.insert(foodItems).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
    }
    
    console.log(`Successfully generated ${count} food items`);
    return { success: true, count };
  } catch (error) {
    console.error('Error generating food items:', error);
    return { success: false, error };
  }
}

// Execute the function immediately
generateFoodItems().then(result => {
  console.log('Generation complete:', result);
}).catch(error => {
  console.error('Generation failed:', error);
});