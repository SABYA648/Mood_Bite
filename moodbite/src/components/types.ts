export interface Result {
    id: number;
    dishName: string;
    restaurant: string;
    eta: string;
    price: string;
  }
  
  export interface Filters {
    veg: boolean;
    egg: boolean;
    nonVeg: boolean;
  }