// Comprehensive built-in fake data store with localStorage persistence and reactive updates
import { Item, Match, ChatMessage, User } from '@/types';
import { calculateMatchConfidence } from './matching';

export const MOCK_USERS: User[] = [
  {
    uid: 'user_student',
    name: 'Student User',
    email: 'student.user@campus.edu',
    role: 'user',
    createdAt: new Date('2024-01-15T09:00:00Z'),
  },
  {
    uid: 'user_admin',
    name: 'Campus Administrator',
    email: 'admin@campus.edu',
    role: 'admin',
    createdAt: new Date('2023-08-01T10:00:00Z'),
  },
  {
    uid: 'user_peer',
    name: 'Peer Student',
    email: 'peer.student@campus.edu',
    role: 'user',
    createdAt: new Date('2024-02-10T11:30:00Z'),
  },
  {
    uid: 'user_student_2',
    name: 'Student Member',
    email: 'student.member@campus.edu',
    role: 'user',
    createdAt: new Date('2024-03-05T14:20:00Z'),
  },
  {
    uid: 'user_volunteer',
    name: 'Campus Volunteer',
    email: 'volunteer@campus.edu',
    role: 'user',
    createdAt: new Date('2024-03-20T16:45:00Z'),
  },
];

const INITIAL_ITEMS: Item[] = [
  {
    id: 'item_1',
    type: 'lost',
    category: 'Accessories',
    description: 'Titan Neo Analog Watch with midnight blue dial and stainless steel mesh strap. Has a tiny scratch near the 2 o clock marker.',
    location: 'Mechanical Engineering Lab 3 (Table #4)',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_student',
    userName: 'Student User',
    userEmail: 'student.user@campus.edu',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_2',
    type: 'found',
    category: 'Accessories',
    description: 'Titan steel wristwatch with blue face found lying on wooden bench near the mechanical workshop entrance.',
    location: 'Workshop Area Corridor bench near Mech Block',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_peer',
    userName: 'Peer Student',
    userEmail: 'peer.student@campus.edu',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_3',
    type: 'lost',
    category: 'Electronics',
    description: 'HP 65W USB-C Fast Charger adapter with black braided cable and small blue electrical tape mark.',
    location: 'Central Library 2nd Floor (Cubicle #14)',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_student',
    userName: 'Student User',
    userEmail: 'student.user@campus.edu',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_4',
    type: 'found',
    category: 'Electronics',
    description: 'Black HP laptop charger with USB Type-C connector left plugged in near the reading desks.',
    location: 'Central Library Main Reading Hall Desk 22',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_student_2',
    userName: 'Student Member',
    userEmail: 'student.member@campus.edu',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_5',
    type: 'lost',
    category: 'ID Cards',
    description: 'Official Campus Student Identity Card with dark blue university lanyard.',
    location: 'Campus Canteen / Cafeteria Outdoor Area',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_student',
    userName: 'Student User',
    userEmail: 'student.user@campus.edu',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_6',
    type: 'found',
    category: 'ID Cards',
    description: 'Student ID card in transparent protective plastic sleeve found on canteen table near billing counter.',
    location: 'Campus Main Gate Security Office',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_volunteer',
    userName: 'Campus Volunteer',
    userEmail: 'volunteer@campus.edu',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_7',
    type: 'lost',
    category: 'Bags',
    description: 'Navy blue Wildcraft 35L college backpack containing engineering mechanics notes and a black water bottle.',
    location: 'Football Ground Spectator Bleachers',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_student_2',
    userName: 'Student Member',
    userEmail: 'student.member@campus.edu',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_8',
    type: 'found',
    category: 'Bags',
    description: 'Wildcraft blue backpack found by sports coaches on the pavilion stairs after evening practice.',
    location: 'Sports Complex Equipment Counter',
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_peer',
    userName: 'Peer Student',
    userEmail: 'peer.student@campus.edu',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_9',
    type: 'lost',
    category: 'Electronics',
    description: 'Casio FX-991CW ClassWiz Scientific Calculator in dark gray with slide case.',
    location: 'CS Block Room 204 (Lecture Hall)',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_volunteer',
    userName: 'Campus Volunteer',
    userEmail: 'volunteer@campus.edu',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_10',
    type: 'found',
    category: 'Electronics',
    description: 'Scientific calculator Casio with slide cover found under bench after lecture class.',
    location: 'CS Block Lab #2 Desk 5',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_student',
    userName: 'Student User',
    userEmail: 'student.user@campus.edu',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'item_11',
    type: 'lost',
    category: 'Keys',
    description: 'Pair of 2 bike keys attached to a red Marvel superhero metallic keychain.',
    location: 'Two-Wheeler Student Parking Lot Zone B',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_peer',
    userName: 'Peer Student',
    userEmail: 'peer.student@campus.edu',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_12',
    type: 'found',
    category: 'Keys',
    description: 'Set of motorcycle keys with metallic keychain picked up on pathway near parking entrance.',
    location: 'Campus Security Guard Post 1',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_volunteer',
    userName: 'Campus Volunteer',
    userEmail: 'volunteer@campus.edu',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_13',
    type: 'lost',
    category: 'Books',
    description: 'Higher Engineering Mathematics textbook (44th edition) with yellow highlight markings.',
    location: 'Electrical Seminar Hall Podium',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    status: 'resolved',
    userId: 'user_student_2',
    userName: 'Student Member',
    userEmail: 'student.member@campus.edu',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'item_14',
    type: 'found',
    category: 'Accessories',
    description: 'Fitness tracker smartwatch with black silicone band and magnetic charging dock.',
    location: 'Basketball Court Side Bench',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    userId: 'user_volunteer',
    userName: 'Campus Volunteer',
    userEmail: 'volunteer@campus.edu',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
];

const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_1',
    lostItemId: 'item_1',
    foundItemId: 'item_2',
    confidence: 94,
    status: 'pending',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'match_2',
    lostItemId: 'item_3',
    foundItemId: 'item_4',
    confidence: 88,
    status: 'pending',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: 'match_3',
    lostItemId: 'item_5',
    foundItemId: 'item_6',
    confidence: 91,
    status: 'pending',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: 'match_4',
    lostItemId: 'item_7',
    foundItemId: 'item_8',
    confidence: 86,
    status: 'pending',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    matchId: 'match_1',
    senderId: 'user_peer',
    senderName: 'Peer Student',
    message: 'Hello! I saw your lost report for the Titan Neo watch. I found a blue-dial stainless watch near the workshop bench yesterday afternoon!',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: 'msg_2',
    matchId: 'match_1',
    senderId: 'user_student',
    senderName: 'Student User',
    message: 'Hello! That sounds exactly like mine! Does it have a slight scratch mark right near the 2 o clock marker on the glass?',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
  {
    id: 'msg_3',
    matchId: 'match_1',
    senderId: 'user_peer',
    senderName: 'Peer Student',
    message: 'Yes! Just checked, there is a tiny scratch right near the 2 o clock mark! It is 100% yours. I deposited it with the Department reception, or we can meet outside the Central Library during lunch.',
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
  },
  {
    id: 'msg_4',
    matchId: 'match_1',
    senderId: 'user_student',
    senderName: 'Student User',
    message: 'You are a lifesaver, thank you so much! Let us meet at 1:30 PM outside the Central Library.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'msg_5',
    matchId: 'match_2',
    senderId: 'user_student_2',
    senderName: 'Student Member',
    message: 'Hey, I picked up an HP 65W Type-C laptop charger from desk 14 on the 2nd floor library reading room. It has a blue tape band on it.',
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
  },
  {
    id: 'msg_6',
    matchId: 'match_2',
    senderId: 'user_student',
    senderName: 'Student User',
    message: 'Hello! Yes, that blue tape is my label! Where can I collect it from you on campus?',
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
  },
  {
    id: 'msg_7',
    matchId: 'match_2',
    senderId: 'user_student_2',
    senderName: 'Student Member',
    message: 'I am in CS Block Room 108 till 4:00 PM today. Feel free to drop by whenever!',
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
  },
];

// In-Memory store fallback
let memoryItems = [...INITIAL_ITEMS];
let memoryMatches = [...INITIAL_MATCHES];
let memoryMessages = [...INITIAL_MESSAGES];
let memoryCurrentUser: User = MOCK_USERS[0];

const STORAGE_KEYS = {
  ITEMS: 'sstc_mock_items_v3',
  MATCHES: 'sstc_mock_matches_v3',
  MESSAGES: 'sstc_mock_messages_v3',
  CURRENT_USER: 'sstc_mock_current_user_v3',
};

const isBrowser = typeof window !== 'undefined';

function safeGetStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(val);
    return reviveDates(parsed);
  } catch (e) {
    return fallback;
  }
}

function safeSetStorage<T>(key: string, data: T) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('mock_store_updated'));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

function reviveDates(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(reviveDates);
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
        res[k] = new Date(v);
      } else if (typeof v === 'object' && v !== null) {
        res[k] = reviveDates(v);
      } else {
        res[k] = v;
      }
    }
    return res;
  }
  return obj;
}

// ----------------- Public Mock Store APIs -----------------

export const mockStore = {
  getCurrentUser(): User {
    return safeGetStorage<User>(STORAGE_KEYS.CURRENT_USER, memoryCurrentUser);
  },

  setCurrentUser(user: User) {
    memoryCurrentUser = user;
    safeSetStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  getAllUsers(): User[] {
    return MOCK_USERS;
  },

  getItems(): Item[] {
    return safeGetStorage<Item[]>(STORAGE_KEYS.ITEMS, memoryItems);
  },

  getItemById(id: string): Item | undefined {
    const items = this.getItems();
    return items.find((i) => i.id === id);
  },

  addItem(itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item {
    const items = this.getItems();
    const newItem: Item = {
      ...itemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [newItem, ...items];
    safeSetStorage(STORAGE_KEYS.ITEMS, updated);
    memoryItems = updated;

    this.recalculateMatches(newItem);
    return newItem;
  },

  updateItem(id: string, updates: Partial<Item>): Item | null {
    const items = this.getItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date(),
    };
    items[index] = updatedItem;
    safeSetStorage(STORAGE_KEYS.ITEMS, items);
    memoryItems = items;
    return updatedItem;
  },

  deleteItem(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter((i) => i.id !== id);
    safeSetStorage(STORAGE_KEYS.ITEMS, filtered);
    memoryItems = filtered;
    return true;
  },

  getMatches(): Match[] {
    return safeGetStorage<Match[]>(STORAGE_KEYS.MATCHES, memoryMatches);
  },

  getMatchById(id: string): Match | undefined {
    return this.getMatches().find((m) => m.id === id);
  },

  createMatch(lostItemId: string, foundItemId: string, confidence: number): Match {
    const matches = this.getMatches();
    const existing = matches.find(
      (m) => m.lostItemId === lostItemId && m.foundItemId === foundItemId
    );
    if (existing) return existing;

    const newMatch: Match = {
      id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      lostItemId,
      foundItemId,
      confidence,
      status: 'pending',
      createdAt: new Date(),
    };

    const updated = [newMatch, ...matches];
    safeSetStorage(STORAGE_KEYS.MATCHES, updated);
    memoryMatches = updated;
    return newMatch;
  },

  recalculateMatches(newItem: Item) {
    const items = this.getItems();
    const otherType = newItem.type === 'lost' ? 'found' : 'lost';
    const counterparts = items.filter((i) => i.type === otherType && i.status === 'open');

    for (const counterpart of counterparts) {
      const lost = newItem.type === 'lost' ? newItem : counterpart;
      const found = newItem.type === 'found' ? newItem : counterpart;
      
      let score = 0;
      if (lost.category === found.category) score += 45;

      const lostWords = lost.description.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const foundWords = found.description.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const matches = lostWords.filter(w => foundWords.some(fw => fw.includes(w) || w.includes(fw)));
      if (matches.length > 0) {
        score += Math.min(40, matches.length * 15);
      }

      if (score >= 45) {
        this.createMatch(lost.id!, found.id!, Math.min(98, score + 10));
      }
    }
  },

  getMessages(matchId?: string): ChatMessage[] {
    const messages = safeGetStorage<ChatMessage[]>(STORAGE_KEYS.MESSAGES, memoryMessages);
    if (matchId) {
      return messages.filter((m) => m.matchId === matchId);
    }
    return messages;
  },

  sendMessage(matchId: string, senderId: string, senderName: string, message: string): ChatMessage {
    const messages = this.getMessages();
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      matchId,
      senderId,
      senderName,
      message,
      createdAt: new Date(),
    };
    const updated = [...messages, newMsg];
    safeSetStorage(STORAGE_KEYS.MESSAGES, updated);
    memoryMessages = updated;
    return newMsg;
  },

  resetToDefault() {
    if (isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.ITEMS);
      localStorage.removeItem(STORAGE_KEYS.MATCHES);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      window.dispatchEvent(new Event('mock_store_updated'));
    }
    memoryItems = [...INITIAL_ITEMS];
    memoryMatches = [...INITIAL_MATCHES];
    memoryMessages = [...INITIAL_MESSAGES];
    memoryCurrentUser = MOCK_USERS[0];
  },
};
