import { db } from '../server/db';
import { foodItems as foodItemsTable } from '../shared/schema';

// Mock food data (we'll need to get this from the client side)
const mockFoodItems = [
  {
    dishName: "Vegetable Biryani",
    restaurant: "Spice Garden",
    eta: "25",
    rating: 4.8,
    price: "$15.99",
    category: "veg",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Butter Chicken",
    restaurant: "Punjab Grill",
    eta: "30",
    rating: 4.7,
    price: "$18.99",
    category: "nonVeg",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Margherita Pizza",
    restaurant: "Italian House",
    eta: "20",
    rating: 4.5,
    price: "$14.99",
    category: "veg",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Chicken Alfredo Pasta",
    restaurant: "Pasta Paradise",
    eta: "25",
    rating: 4.6,
    price: "$16.99",
    category: "nonVeg",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Egg Fried Rice",
    restaurant: "Dragon Wok",
    eta: "15",
    rating: 4.3,
    price: "$12.99",
    category: "egg",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Paneer Tikka",
    restaurant: "Taj Mahal",
    eta: "20",
    rating: 4.4,
    price: "$14.50",
    category: "veg",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a252b8eee?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Beef Burger",
    restaurant: "Burger Joint",
    eta: "15",
    rating: 4.2,
    price: "$10.99",
    category: "nonVeg",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Egg Benedict",
    restaurant: "Breakfast Club",
    eta: "20",
    rating: 4.6,
    price: "$13.99",
    category: "egg",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Vegan Buddha Bowl",
    restaurant: "Green Eats",
    eta: "20",
    rating: 4.7,
    price: "$15.50",
    category: "veg",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Grilled Salmon",
    restaurant: "Ocean Delights",
    eta: "25",
    rating: 4.8,
    price: "$22.99",
    category: "nonVeg",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Spinach Omelette",
    restaurant: "Morning Star",
    eta: "15",
    rating: 4.4,
    price: "$11.99",
    category: "egg",
    image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  },
  {
    dishName: "Mushroom Risotto",
    restaurant: "Bella Italia",
    eta: "30",
    rating: 4.5,
    price: "$17.50",
    category: "veg",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
  }
];

export async function seedDatabase() {
  console.log('Checking if food items data needs to be seeded...');
  
  try {
    // Check if we already have food items in the database
    const existingItems = await db.select().from(foodItemsTable);
    
    if (existingItems.length === 0) {
      console.log('Seeding food items data...');
      
      // Insert all items at once since we have a small dataset
      await db.insert(foodItemsTable).values(mockFoodItems);
      console.log(`Inserted ${mockFoodItems.length} food items successfully.`);
      return { success: true, count: mockFoodItems.length };
    } else {
      console.log(`Food items data already exists (${existingItems.length} items). Skipping seed.`);
      return { success: false, count: existingItems.length };
    }
  } catch (error) {
    console.error('Failed to seed food items:', error);
    throw error;
  }
}

// Run the database seeding if this file is executed directly
// This is needed for ESM compatibility
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => console.log('Database seeding completed!'))
    .catch((err) => {
      console.error('Error during seeding:', err);
      process.exit(1);
    });
}