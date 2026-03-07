export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Bangles' | 'Earrings' | 'Necklace' | 'Hair Accessories';
  subCategory?: string;
  image: string;
  images: string[];
  description: string;
  trending?: boolean;
  topSelling?: boolean;
  newArrival?: boolean;
  under500?: boolean;
  sizes?: string[];
  inStock?: boolean;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role?: 'Customer' | 'Admin';
  phone?: string;
  addressLine1?: string;
  city?: string;
  pincode?: string;
  profileImage?: string;
}

export interface Order {
  OrderID: number;
  OrderDate: string;
  TotalAmount: number;
  Status: string;
  PaymentMethod: string;
  ShippingAddress: string;
}

export interface OrderItem {
  OrderItemID: number;
  OrderID: number;
  ProductID: number;
  Quantity: number;
  Price: number;
  Size?: string;
  Name: string;
  ImageURL: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}
