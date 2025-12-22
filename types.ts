export interface Product {
  id: string;
  title: string;
  price: number; // This is the Selling Price
  original_price?: number; // This is the MSRP / Higher Price
  category: string;
  thumbnail: string;
  rating: number;
  stock: number;
  description?: string; 
  brand?: string; 
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = 'Guns' | 'Missiles' | 'Rockets' | 'Drones/UAVs';