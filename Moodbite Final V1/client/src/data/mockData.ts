export interface FoodItem {
  id: number;
  dishName: string;
  restaurant: string;
  eta: string;
  rating: number;
  price: string;
  category: string;
  image: string;
}

export const foodItems: FoodItem[] = [
  {
    id: 1,
    dishName: "Spicy Chicken Tikka",
    restaurant: "Tandoori Nights",
    eta: "25",
    rating: 4.5,
    price: "₹350",
    category: "nonVeg",
    image: "https://source.unsplash.com/xayCTz6N0jM/400x300"
  },
  {
    id: 2,
    dishName: "Butter Chicken",
    restaurant: "Punjab Grill",
    eta: "30",
    rating: 4.8,
    price: "₹420",
    category: "nonVeg",
    image: "https://source.unsplash.com/auIbTAcSH6E/400x300"
  },
  {
    id: 3,
    dishName: "Chicken Biryani",
    restaurant: "Biryani House",
    eta: "15",
    rating: 4.3,
    price: "₹280",
    category: "nonVeg",
    image: "https://source.unsplash.com/MqT0asuoIcU/400x300"
  },
  {
    id: 4,
    dishName: "Spicy Noodles",
    restaurant: "Wok & Roll",
    eta: "20",
    rating: 4.1,
    price: "₹250",
    category: "veg",
    image: "https://source.unsplash.com/SqYmTDQYMjo/400x300"
  },
  {
    id: 5,
    dishName: "Andhra Chicken",
    restaurant: "Spice Garden",
    eta: "35",
    rating: 4.7,
    price: "₹380",
    category: "nonVeg",
    image: "https://source.unsplash.com/eeqbbemH9-c/400x300"
  },
  {
    id: 6,
    dishName: "Chilli Prawns",
    restaurant: "Coastal Delights",
    eta: "25",
    rating: 4.6,
    price: "₹450",
    category: "nonVeg",
    image: "https://source.unsplash.com/9aOswReDKPo/400x300"
  },
  {
    id: 7,
    dishName: "Paneer Tikka Masala",
    restaurant: "Punjabi Tadka",
    eta: "22",
    rating: 4.4,
    price: "₹320",
    category: "veg",
    image: "https://source.unsplash.com/IGfIGP5ONV0/400x300"
  },
  {
    id: 8,
    dishName: "Egg Curry",
    restaurant: "Andaa Express",
    eta: "30",
    rating: 4.2,
    price: "₹220",
    category: "egg",
    image: "https://source.unsplash.com/rXKThd24hmQ/400x300"
  },
  {
    id: 9,
    dishName: "Veg Pulao",
    restaurant: "Rice King",
    eta: "18",
    rating: 4.0,
    price: "₹180",
    category: "veg",
    image: "https://source.unsplash.com/8SMuloMpREE/400x300"
  },
  {
    id: 10,
    dishName: "Egg Biryani",
    restaurant: "Biryani House",
    eta: "25",
    rating: 4.3,
    price: "₹260",
    category: "egg",
    image: "https://source.unsplash.com/XaDsH-O2QXs/400x300"
  },
  {
    id: 11,
    dishName: "Malai Kofta",
    restaurant: "Punjabi Tadka",
    eta: "28",
    rating: 4.5,
    price: "₹290",
    category: "veg",
    image: "https://source.unsplash.com/7Bn_8jLXMY0/400x300"
  },
  {
    id: 12,
    dishName: "Chicken Tikka Roll",
    restaurant: "Roll Express",
    eta: "15",
    rating: 4.2,
    price: "₹180",
    category: "nonVeg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 13,
    dishName: "Masala Dosa",
    restaurant: "South Indian Delight",
    eta: "15",
    rating: 4.4,
    price: "₹120",
    category: "veg",
    image: "https://source.unsplash.com/nKS0D5JUAA4/400x300"
  },
  {
    id: 14,
    dishName: "Mushroom Curry",
    restaurant: "Veg Paradise",
    eta: "25",
    rating: 4.1,
    price: "₹210",
    category: "veg",
    image: "https://source.unsplash.com/hV1GDAQmxAs/400x300"
  },
  {
    id: 15,
    dishName: "Fish Curry",
    restaurant: "Coastal Delights",
    eta: "30",
    rating: 4.7,
    price: "₹420",
    category: "nonVeg",
    image: "https://source.unsplash.com/XPR6Wq3jUg4/400x300"
  },
  {
    id: 16,
    dishName: "Egg Fried Rice",
    restaurant: "Wok & Roll",
    eta: "20",
    rating: 4.3,
    price: "₹220",
    category: "egg",
    image: "https://source.unsplash.com/xZgkyWdXBj8/400x300"
  },
  {
    id: 17,
    dishName: "Dal Makhani",
    restaurant: "Punjabi Tadka",
    eta: "25",
    rating: 4.6,
    price: "₹250",
    category: "veg",
    image: "https://source.unsplash.com/1SPu0KT-Ejg/400x300"
  },
  {
    id: 18,
    dishName: "Chicken 65",
    restaurant: "Spice Garden",
    eta: "22",
    rating: 4.4,
    price: "₹320",
    category: "nonVeg",
    image: "https://source.unsplash.com/e5b21bACt_Q/400x300"
  },
  {
    id: 19,
    dishName: "Kadai Paneer",
    restaurant: "Punjabi Tadka",
    eta: "28",
    rating: 4.5,
    price: "₹330",
    category: "veg",
    image: "https://source.unsplash.com/ylgkbqqzHnU/400x300"
  },
  {
    id: 20,
    dishName: "Egg Bhurji",
    restaurant: "Andaa Express",
    eta: "15",
    rating: 4.2,
    price: "₹180",
    category: "egg",
    image: "https://source.unsplash.com/55F-LhzzeH8/400x300"
  },
  {
    id: 21,
    dishName: "Hyderabadi Biryani",
    restaurant: "Biryani House",
    eta: "35",
    rating: 4.8,
    price: "₹380",
    category: "nonVeg",
    image: "https://source.unsplash.com/kcA-c3f_3FE/400x300"
  },
  {
    id: 22,
    dishName: "Palak Paneer",
    restaurant: "Punjabi Tadka",
    eta: "25",
    rating: 4.4,
    price: "₹290",
    category: "veg",
    image: "https://source.unsplash.com/6e8YuMdQGAA/400x300"
  },
  {
    id: 23,
    dishName: "Chilli Chicken",
    restaurant: "Chinese Wok",
    eta: "20",
    rating: 4.5,
    price: "₹320",
    category: "nonVeg",
    image: "https://source.unsplash.com/kQloRmVKCbI/400x300"
  },
  {
    id: 24,
    dishName: "Veg Biryani",
    restaurant: "Biryani House",
    eta: "25",
    rating: 4.2,
    price: "₹240",
    category: "veg",
    image: "https://source.unsplash.com/gLsM1Qq3osE/400x300"
  },
  {
    id: 25,
    dishName: "Mutton Curry",
    restaurant: "Spice Garden",
    eta: "40",
    rating: 4.7,
    price: "₹450",
    category: "nonVeg",
    image: "https://source.unsplash.com/Oalh2MojUuk/400x300"
  },
  {
    id: 26,
    dishName: "Chole Bhature",
    restaurant: "Punjabi Tadka",
    eta: "25",
    rating: 4.6,
    price: "₹220",
    category: "veg",
    image: "https://source.unsplash.com/7e4JZQUbTmY/400x300"
  },
  {
    id: 27,
    dishName: "Egg Curry Rice",
    restaurant: "Andaa Express",
    eta: "22",
    rating: 4.3,
    price: "₹250",
    category: "egg",
    image: "https://source.unsplash.com/gE28aTnlqJA/400x300"
  },
  {
    id: 28,
    dishName: "Tandoori Chicken",
    restaurant: "Tandoori Nights",
    eta: "30",
    rating: 4.6,
    price: "₹350",
    category: "nonVeg",
    image: "https://source.unsplash.com/PyJp-kg9L5c/400x300"
  },
  {
    id: 29,
    dishName: "Paneer Butter Masala",
    restaurant: "Punjab Grill",
    eta: "25",
    rating: 4.5,
    price: "₹320",
    category: "veg",
    image: "https://source.unsplash.com/6WHl6T-fxU8/400x300"
  },
  {
    id: 30,
    dishName: "Chicken Fried Rice",
    restaurant: "Wok & Roll",
    eta: "18",
    rating: 4.2,
    price: "₹250",
    category: "nonVeg",
    image: "https://source.unsplash.com/IGfIGP5ONV0/400x300"
  },
  {
    id: 31,
    dishName: "Veg Hakka Noodles",
    restaurant: "Chinese Wok",
    eta: "20",
    rating: 4.1,
    price: "₹220",
    category: "veg",
    image: "https://source.unsplash.com/SqYmTDQYMjo/400x300"
  },
  {
    id: 32,
    dishName: "Egg Noodles",
    restaurant: "Chinese Wok",
    eta: "22",
    rating: 4.3,
    price: "₹240",
    category: "egg",
    image: "https://source.unsplash.com/9aOswReDKPo/400x300"
  },
  {
    id: 33,
    dishName: "Chicken Korma",
    restaurant: "Mughlai Palace",
    eta: "30",
    rating: 4.6,
    price: "₹380",
    category: "nonVeg",
    image: "https://source.unsplash.com/auIbTAcSH6E/400x300"
  },
  {
    id: 34,
    dishName: "Veg Korma",
    restaurant: "Mughlai Palace",
    eta: "25",
    rating: 4.4,
    price: "₹320",
    category: "veg",
    image: "https://source.unsplash.com/7Bn_8jLXMY0/400x300"
  },
  {
    id: 35,
    dishName: "Chicken Tikka Biryani",
    restaurant: "Biryani House",
    eta: "35",
    rating: 4.7,
    price: "₹390",
    category: "nonVeg",
    image: "https://source.unsplash.com/MqT0asuoIcU/400x300"
  },
  {
    id: 36,
    dishName: "Masala Egg Burji",
    restaurant: "Andaa Express",
    eta: "18",
    rating: 4.2,
    price: "₹180",
    category: "egg",
    image: "https://source.unsplash.com/55F-LhzzeH8/400x300"
  },
  {
    id: 37,
    dishName: "Garlic Naan",
    restaurant: "Punjabi Tadka",
    eta: "15",
    rating: 4.5,
    price: "₹60",
    category: "veg",
    image: "https://source.unsplash.com/8SMuloMpREE/400x300"
  },
  {
    id: 38,
    dishName: "Prawn Curry",
    restaurant: "Coastal Delights",
    eta: "30",
    rating: 4.7,
    price: "₹450",
    category: "nonVeg",
    image: "https://source.unsplash.com/XPR6Wq3jUg4/400x300"
  },
  {
    id: 39,
    dishName: "Idli Sambar",
    restaurant: "South Indian Delight",
    eta: "15",
    rating: 4.3,
    price: "₹150",
    category: "veg",
    image: "https://source.unsplash.com/nKS0D5JUAA4/400x300"
  },
  {
    id: 40,
    dishName: "Egg Dosa",
    restaurant: "South Indian Delight",
    eta: "18",
    rating: 4.2,
    price: "₹180",
    category: "egg",
    image: "https://source.unsplash.com/nKS0D5JUAA4/400x300"
  },
  {
    id: 41,
    dishName: "Chicken Shawarma",
    restaurant: "Arabian Nights",
    eta: "15",
    rating: 4.4,
    price: "₹220",
    category: "nonVeg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 42,
    dishName: "Falafel Wrap",
    restaurant: "Arabian Nights",
    eta: "15",
    rating: 4.2,
    price: "₹180",
    category: "veg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 43,
    dishName: "Butter Naan",
    restaurant: "Punjabi Tadka",
    eta: "15",
    rating: 4.5,
    price: "₹70",
    category: "veg",
    image: "https://source.unsplash.com/8SMuloMpREE/400x300"
  },
  {
    id: 44,
    dishName: "Chicken Lollipop",
    restaurant: "Chinese Wok",
    eta: "25",
    rating: 4.5,
    price: "₹350",
    category: "nonVeg",
    image: "https://source.unsplash.com/e5b21bACt_Q/400x300"
  },
  {
    id: 45,
    dishName: "Pav Bhaji",
    restaurant: "Mumbai Street Food",
    eta: "20",
    rating: 4.3,
    price: "₹160",
    category: "veg",
    image: "https://source.unsplash.com/6WHl6T-fxU8/400x300"
  },
  {
    id: 46,
    dishName: "Egg Kathi Roll",
    restaurant: "Roll Express",
    eta: "15",
    rating: 4.2,
    price: "₹150",
    category: "egg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 47,
    dishName: "Fish Fry",
    restaurant: "Coastal Delights",
    eta: "25",
    rating: 4.5,
    price: "₹350",
    category: "nonVeg",
    image: "https://source.unsplash.com/XPR6Wq3jUg4/400x300"
  },
  {
    id: 48,
    dishName: "Veg Manchurian",
    restaurant: "Chinese Wok",
    eta: "20",
    rating: 4.2,
    price: "₹220",
    category: "veg",
    image: "https://source.unsplash.com/SqYmTDQYMjo/400x300"
  },
  {
    id: 49,
    dishName: "Egg Manchurian",
    restaurant: "Chinese Wok",
    eta: "22",
    rating: 4.1,
    price: "₹240",
    category: "egg",
    image: "https://source.unsplash.com/SqYmTDQYMjo/400x300"
  },
  {
    id: 50,
    dishName: "Chicken Manchurian",
    restaurant: "Chinese Wok",
    eta: "25",
    rating: 4.4,
    price: "₹280",
    category: "nonVeg",
    image: "https://source.unsplash.com/SqYmTDQYMjo/400x300"
  },
  {
    id: 51,
    dishName: "Veg Spring Rolls",
    restaurant: "Chinese Wok",
    eta: "18",
    rating: 4.1,
    price: "₹180",
    category: "veg",
    image: "https://source.unsplash.com/9aOswReDKPo/400x300"
  },
  {
    id: 52,
    dishName: "Chicken Spring Rolls",
    restaurant: "Chinese Wok",
    eta: "20",
    rating: 4.3,
    price: "₹220",
    category: "nonVeg",
    image: "https://source.unsplash.com/9aOswReDKPo/400x300"
  },
  {
    id: 53,
    dishName: "Egg Paratha",
    restaurant: "Andaa Express",
    eta: "20",
    rating: 4.2,
    price: "₹150",
    category: "egg",
    image: "https://source.unsplash.com/xayCTz6N0jM/400x300"
  },
  {
    id: 54,
    dishName: "Butter Chicken Kulcha",
    restaurant: "Punjab Grill",
    eta: "25",
    rating: 4.6,
    price: "₹280",
    category: "nonVeg",
    image: "https://source.unsplash.com/auIbTAcSH6E/400x300"
  },
  {
    id: 55,
    dishName: "Veg Thali",
    restaurant: "Punjabi Tadka",
    eta: "30",
    rating: 4.5,
    price: "₹250",
    category: "veg",
    image: "https://source.unsplash.com/IGfIGP5ONV0/400x300"
  },
  {
    id: 56,
    dishName: "Non-Veg Thali",
    restaurant: "Punjabi Tadka",
    eta: "35",
    rating: 4.6,
    price: "₹350",
    category: "nonVeg",
    image: "https://source.unsplash.com/xayCTz6N0jM/400x300"
  },
  {
    id: 57,
    dishName: "Bombay Sandwich",
    restaurant: "Mumbai Street Food",
    eta: "15",
    rating: 4.2,
    price: "₹120",
    category: "veg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 58,
    dishName: "Chicken Sandwich",
    restaurant: "Mumbai Street Food",
    eta: "18",
    rating: 4.3,
    price: "₹180",
    category: "nonVeg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 59,
    dishName: "Egg Sandwich",
    restaurant: "Mumbai Street Food",
    eta: "15",
    rating: 4.1,
    price: "₹150",
    category: "egg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 60,
    dishName: "Veg Burger",
    restaurant: "Burger Joint",
    eta: "15",
    rating: 4.2,
    price: "₹180",
    category: "veg",
    image: "https://source.unsplash.com/6WHl6T-fxU8/400x300"
  },
  {
    id: 61,
    dishName: "Chicken Burger",
    restaurant: "Burger Joint",
    eta: "18",
    rating: 4.4,
    price: "₹220",
    category: "nonVeg",
    image: "https://source.unsplash.com/e5b21bACt_Q/400x300"
  },
  {
    id: 62,
    dishName: "Egg Burger",
    restaurant: "Burger Joint",
    eta: "15",
    rating: 4.2,
    price: "₹200",
    category: "egg",
    image: "https://source.unsplash.com/6WHl6T-fxU8/400x300"
  },
  {
    id: 63,
    dishName: "Rajma Chawal",
    restaurant: "Punjabi Tadka",
    eta: "25",
    rating: 4.3,
    price: "₹200",
    category: "veg",
    image: "https://source.unsplash.com/IGfIGP5ONV0/400x300"
  },
  {
    id: 64,
    dishName: "Chicken Curry Rice",
    restaurant: "Spice Garden",
    eta: "28",
    rating: 4.5,
    price: "₹280",
    category: "nonVeg",
    image: "https://source.unsplash.com/eeqbbemH9-c/400x300"
  },
  {
    id: 65,
    dishName: "Veg Pulao",
    restaurant: "Biryani House",
    eta: "22",
    rating: 4.2,
    price: "₹200",
    category: "veg",
    image: "https://source.unsplash.com/8SMuloMpREE/400x300"
  },
  {
    id: 66,
    dishName: "Chicken Pulao",
    restaurant: "Biryani House",
    eta: "25",
    rating: 4.4,
    price: "₹280",
    category: "nonVeg",
    image: "https://source.unsplash.com/MqT0asuoIcU/400x300"
  },
  {
    id: 67,
    dishName: "Egg Pulao",
    restaurant: "Biryani House",
    eta: "22",
    rating: 4.3,
    price: "₹240",
    category: "egg",
    image: "https://source.unsplash.com/XaDsH-O2QXs/400x300"
  },
  {
    id: 68,
    dishName: "Vegetable Biryani",
    restaurant: "Biryani House",
    eta: "28",
    rating: 4.2,
    price: "₹220",
    category: "veg",
    image: "https://source.unsplash.com/gLsM1Qq3osE/400x300"
  },
  {
    id: 69,
    dishName: "Chicken Tikka Masala",
    restaurant: "Tandoori Nights",
    eta: "30",
    rating: 4.7,
    price: "₹380",
    category: "nonVeg",
    image: "https://source.unsplash.com/PyJp-kg9L5c/400x300"
  },
  {
    id: 70,
    dishName: "Paneer Tikka",
    restaurant: "Tandoori Nights",
    eta: "25",
    rating: 4.5,
    price: "₹320",
    category: "veg",
    image: "https://source.unsplash.com/IGfIGP5ONV0/400x300"
  },
  {
    id: 71,
    dishName: "Egg Masala",
    restaurant: "Andaa Express",
    eta: "22",
    rating: 4.2,
    price: "₹200",
    category: "egg",
    image: "https://source.unsplash.com/rXKThd24hmQ/400x300"
  },
  {
    id: 72,
    dishName: "Veg Fried Rice",
    restaurant: "Wok & Roll",
    eta: "18",
    rating: 4.1,
    price: "₹180",
    category: "veg",
    image: "https://source.unsplash.com/xZgkyWdXBj8/400x300"
  },
  {
    id: 73,
    dishName: "Spicy Fish Curry",
    restaurant: "Coastal Delights",
    eta: "30",
    rating: 4.6,
    price: "₹420",
    category: "nonVeg",
    image: "https://source.unsplash.com/XPR6Wq3jUg4/400x300"
  },
  {
    id: 74,
    dishName: "Mushroom Masala",
    restaurant: "Veg Paradise",
    eta: "25",
    rating: 4.3,
    price: "₹260",
    category: "veg",
    image: "https://source.unsplash.com/hV1GDAQmxAs/400x300"
  },
  {
    id: 75,
    dishName: "Egg Kothu Parotta",
    restaurant: "South Indian Delight",
    eta: "25",
    rating: 4.4,
    price: "₹220",
    category: "egg",
    image: "https://source.unsplash.com/55F-LhzzeH8/400x300"
  },
  {
    id: 76,
    dishName: "Chicken Curry",
    restaurant: "Spice Garden",
    eta: "28",
    rating: 4.5,
    price: "₹320",
    category: "nonVeg",
    image: "https://source.unsplash.com/kQloRmVKCbI/400x300"
  },
  {
    id: 77,
    dishName: "Vegetable Curry",
    restaurant: "Veg Paradise",
    eta: "25",
    rating: 4.2,
    price: "₹220",
    category: "veg",
    image: "https://source.unsplash.com/hV1GDAQmxAs/400x300"
  },
  {
    id: 78,
    dishName: "Egg Curry Rice",
    restaurant: "Andaa Express",
    eta: "22",
    rating: 4.3,
    price: "₹240",
    category: "egg",
    image: "https://source.unsplash.com/gE28aTnlqJA/400x300"
  },
  {
    id: 79,
    dishName: "Mutton Biryani",
    restaurant: "Biryani House",
    eta: "35",
    rating: 4.8,
    price: "₹420",
    category: "nonVeg",
    image: "https://source.unsplash.com/kcA-c3f_3FE/400x300"
  },
  {
    id: 80,
    dishName: "Vegetable Manchurian",
    restaurant: "Chinese Wok",
    eta: "20",
    rating: 4.2,
    price: "₹220",
    category: "veg",
    image: "https://source.unsplash.com/SqYmTDQYMjo/400x300"
  },
  {
    id: 81,
    dishName: "Egg Roll",
    restaurant: "Roll Express",
    eta: "15",
    rating: 4.1,
    price: "₹150",
    category: "egg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 82,
    dishName: "Chicken Tikka Roll",
    restaurant: "Roll Express",
    eta: "18",
    rating: 4.3,
    price: "₹180",
    category: "nonVeg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 83,
    dishName: "Paneer Roll",
    restaurant: "Roll Express",
    eta: "15",
    rating: 4.2,
    price: "₹160",
    category: "veg",
    image: "https://source.unsplash.com/-YHSwy6uqvk/400x300"
  },
  {
    id: 84,
    dishName: "Chicken Malai Tikka",
    restaurant: "Tandoori Nights",
    eta: "30",
    rating: 4.6,
    price: "₹380",
    category: "nonVeg",
    image: "https://source.unsplash.com/PyJp-kg9L5c/400x300"
  },
  {
    id: 85,
    dishName: "Paneer Malai Tikka",
    restaurant: "Tandoori Nights",
    eta: "25",
    rating: 4.4,
    price: "₹320",
    category: "veg",
    image: "https://source.unsplash.com/IGfIGP5ONV0/400x300"
  },
  {
    id: 86,
    dishName: "Egg Masala Dosa",
    restaurant: "South Indian Delight",
    eta: "20",
    rating: 4.3,
    price: "₹180",
    category: "egg",
    image: "https://source.unsplash.com/nKS0D5JUAA4/400x300"
  },
  {
    id: 87,
    dishName: "Chicken Chettinad",
    restaurant: "South Indian Delight",
    eta: "30",
    rating: 4.7,
    price: "₹380",
    category: "nonVeg",
    image: "https://source.unsplash.com/kQloRmVKCbI/400x300"
  },
  {
    id: 88,
    dishName: "Vegetable Uttapam",
    restaurant: "South Indian Delight",
    eta: "20",
    rating: 4.2,
    price: "₹180",
    category: "veg",
    image: "https://source.unsplash.com/nKS0D5JUAA4/400x300"
  },
  {
    id: 89,
    dishName: "Egg Uttapam",
    restaurant: "South Indian Delight",
    eta: "22",
    rating: 4.1,
    price: "₹200",
    category: "egg",
    image: "https://source.unsplash.com/nKS0D5JUAA4/400x300"
  },
  {
    id: 90,
    dishName: "Fish Fry",
    restaurant: "Coastal Delights",
    eta: "25",
    rating: 4.5,
    price: "₹350",
    category: "nonVeg",
    image: "https://source.unsplash.com/XPR6Wq3jUg4/400x300"
  },
  {
    id: 91,
    dishName: "Gobi Manchurian",
    restaurant: "Chinese Wok",
    eta: "20",
    rating: 4.2,
    price: "₹220",
    category: "veg",
    image: "https://source.unsplash.com/SqYmTDQYMjo/400x300"
  },
  {
    id: 92,
    dishName: "Egg Fried Rice",
    restaurant: "Chinese Wok",
    eta: "20",
    rating: 4.1,
    price: "₹220",
    category: "egg",
    image: "https://source.unsplash.com/xZgkyWdXBj8/400x300"
  },
  {
    id: 93,
    dishName: "Chicken Hakka Noodles",
    restaurant: "Chinese Wok",
    eta: "22",
    rating: 4.3,
    price: "₹240",
    category: "nonVeg",
    image: "https://source.unsplash.com/SqYmTDQYMjo/400x300"
  },
  {
    id: 94,
    dishName: "Paneer Butter Masala",
    restaurant: "Punjabi Tadka",
    eta: "25",
    rating: 4.5,
    price: "₹320",
    category: "veg",
    image: "https://source.unsplash.com/6WHl6T-fxU8/400x300"
  },
  {
    id: 95,
    dishName: "Egg Bhurji Paratha",
    restaurant: "Andaa Express",
    eta: "20",
    rating: 4.2,
    price: "₹180",
    category: "egg",
    image: "https://source.unsplash.com/55F-LhzzeH8/400x300"
  },
  {
    id: 96,
    dishName: "Butter Chicken",
    restaurant: "Punjab Grill",
    eta: "30",
    rating: 4.7,
    price: "₹380",
    category: "nonVeg",
    image: "https://source.unsplash.com/auIbTAcSH6E/400x300"
  },
  {
    id: 97,
    dishName: "Veg Kofta",
    restaurant: "Punjabi Tadka",
    eta: "25",
    rating: 4.3,
    price: "₹280",
    category: "veg",
    image: "https://source.unsplash.com/7Bn_8jLXMY0/400x300"
  },
  {
    id: 98,
    dishName: "Egg Curry",
    restaurant: "Andaa Express",
    eta: "22",
    rating: 4.2,
    price: "₹220",
    category: "egg",
    image: "https://source.unsplash.com/rXKThd24hmQ/400x300"
  },
  {
    id: 99,
    dishName: "Chicken Curry",
    restaurant: "Spice Garden",
    eta: "28",
    rating: 4.5,
    price: "₹320",
    category: "nonVeg",
    image: "https://source.unsplash.com/kQloRmVKCbI/400x300"
  },
  {
    id: 100,
    dishName: "Vegetable Curry",
    restaurant: "Veg Paradise",
    eta: "25",
    rating: 4.2,
    price: "₹220",
    category: "veg",
    image: "https://source.unsplash.com/hV1GDAQmxAs/400x300"
  }
];
