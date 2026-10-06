export type UserRole = "buyer" | "seller" | "admin";

export type ListingCategory = "game_key" | "top_up" | "in_game_item" | "software_license";

export type DeliveryType = "instant_key" | "manual_code" | "top_up_uid";

export type OrderStatus =
  | "pending_payment"
  | "escrow_held"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled"
  | "refunded";

export interface SellerProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  salesCount: number;
  responseMinutes: number;
  verified: boolean;
  bio: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: ListingCategory;
  game: string;
  region: string;
  deliveryType: DeliveryType;
  pricePhp: number;
  stock: number;
  active: boolean;
  imageHue: number;
  tags: string[];
  createdAt: string;
}

export interface DeliveryPayload {
  orderId: string;
  /** Encoded secret — never log or put in URLs */
  ciphertext: string;
  deliveredAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amountPhp: number;
  platformFeePhp: number;
  status: OrderStatus;
  paymentMethod: "gcash" | "maya" | "card";
  paymentRef?: string;
  buyerNote?: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  listingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface EscrowEvent {
  id: string;
  orderId: string;
  type: string;
  message: string;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  game_key: "Game Keys",
  top_up: "Top-ups",
  in_game_item: "In-game Items",
  software_license: "Software Licenses",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending payment",
  escrow_held: "Escrow held",
  delivered: "Delivered",
  completed: "Completed",
  disputed: "Disputed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};
