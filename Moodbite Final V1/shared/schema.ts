import { pgTable, text, serial, real, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Food items table
export const foodItems = pgTable("food_items", {
  id: serial("id").primaryKey(),
  dishName: text("dish_name").notNull(),
  restaurant: text("restaurant").notNull(),
  eta: varchar("eta", { length: 10 }).notNull(), // Stored as string like "25"
  rating: real("rating").notNull(),
  price: text("price").notNull(),
  category: text("category").notNull(), // "veg", "nonVeg", "egg"
  image: text("image").notNull(),
  // Nutritional information
  calories: real("calories").default(0),
  protein: real("protein").default(0), // in grams
  carbs: real("carbs").default(0), // in grams
  fat: real("fat").default(0), // in grams
  fiber: real("fiber").default(0), // in grams
  sugar: real("sugar").default(0), // in grams
  sodium: real("sodium").default(0), // in mg
  healthScore: real("health_score").default(50), // 0-100 scale
});

export const insertFoodItemSchema = createInsertSchema(foodItems).omit({
  id: true,
});

export type InsertFoodItem = z.infer<typeof insertFoodItemSchema>;
export type FoodItem = typeof foodItems.$inferSelect;

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  vegFilter: boolean("veg_filter").default(false),
  eggFilter: boolean("egg_filter").default(false),
  nonVegFilter: boolean("non_veg_filter").default(false),
  sortPreference: text("sort_preference").default("Relevance"),
  lastMood: text("last_mood").default("😋"),
  lastMoodText: text("last_mood_text").default("What are you craving?"),
});

export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;
export type UserPreference = typeof userPreferences.$inferSelect;
