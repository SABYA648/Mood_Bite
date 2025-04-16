import { 
  users, foodItems, userPreferences,
  type User, type InsertUser,
  type FoodItem, type InsertFoodItem,
  type UserPreference, type InsertUserPreference
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Food operations
  getAllFoodItems(): Promise<FoodItem[]>;
  getFoodItemById(id: number): Promise<FoodItem | undefined>;
  createFoodItem(item: InsertFoodItem): Promise<FoodItem>;
  
  // User preferences operations
  getUserPreferences(userId: number): Promise<UserPreference | undefined>;
  createUserPreferences(prefs: InsertUserPreference): Promise<UserPreference>;
  updateUserPreferences(id: number, prefs: Partial<UserPreference>): Promise<UserPreference | undefined>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Food operations
  async getAllFoodItems(): Promise<FoodItem[]> {
    return await db.select().from(foodItems);
  }
  
  async getFoodItemById(id: number): Promise<FoodItem | undefined> {
    const result = await db.select().from(foodItems).where(eq(foodItems.id, id));
    return result[0];
  }
  
  async createFoodItem(item: InsertFoodItem): Promise<FoodItem> {
    const result = await db.insert(foodItems).values(item).returning();
    return result[0];
  }
  
  // User preferences operations
  async getUserPreferences(userId: number): Promise<UserPreference | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return result[0];
  }
  
  async createUserPreferences(prefs: InsertUserPreference): Promise<UserPreference> {
    const result = await db.insert(userPreferences).values(prefs).returning();
    return result[0];
  }
  
  async updateUserPreferences(id: number, prefs: Partial<UserPreference>): Promise<UserPreference | undefined> {
    const result = await db
      .update(userPreferences)
      .set(prefs)
      .where(eq(userPreferences.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
