export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
  };
  location: string;
  datePosted: string;
  status: 'available' | 'sold' | 'reserved';
  tags: string[];
  views: number;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  university: string;
  rating: number;
  reviewCount: number;
  joinDate: string;
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  itemId: string;
  content: string;
  timestamp: string;
  read: boolean;
}