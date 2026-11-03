export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'matched' | 'resolved';
export type MatchStatus = 'pending' | 'confirmed' | 'rejected' | 'resolved';
export type UserRole = 'user' | 'admin';

export const ITEM_CATEGORIES = [
  'Electronics',
  'Accessories',
  'ID Cards',
  'Bags',
  'Keys',
  'Books',
  'Clothing',
  'Other',
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Item {
  id: string;
  type: ItemType;
  category: string;
  description: string;
  location: string;
  imageUrl?: string;
  status: ItemStatus;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  lostItemId: string;
  foundItemId: string;
  confidence: number;
  status: MatchStatus;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: Date;
}
