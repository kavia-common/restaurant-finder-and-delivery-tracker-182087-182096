export type ID = string;

// Core domain types
export interface RestaurantInfo {
  id: ID;
  name: string;
}

export interface CartItem {
  id: ID; // unique line item id
  restaurantId: ID;
  restaurantName: string;
  menuItemId: ID;
  name: string;
  price: number; // per unit
  quantity: number;
  imageUrl?: string;
  options?: Record<string, string | number | boolean>; // size, spice level, etc.
  notes?: string;
}

export interface CartState {
  items: CartItem[];
  // single restaurant constraint: all items must be from this restaurant if set
  restaurant?: RestaurantInfo | null;
  // computed values
  subtotal: number;
  totalQuantity: number;
}

export interface UserProfile {
  id: ID;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UserState {
  token?: string | null;
  profile?: UserProfile | null;
  isAuthenticated: boolean;
}

export type OrderStatus =
  | "idle"
  | "creating"
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "error";

export interface OrderState {
  activeOrderId?: ID | null;
  status: OrderStatus;
  // whether user opted into real-time updates for current order
  subscribedToUpdates: boolean;
  lastUpdatedAt?: number | null; // epoch ms
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  durationMs?: number;
}

export interface UIState {
  loading: boolean;
  toasts: Toast[];
}

// Root store type composed by slices
export interface RootStore {
  // populated via slices
  cart: CartState;
  user: UserState;
  order: OrderState;
  ui: UIState;
}
