import type { Listing, SellerProfile } from "@/lib/types";

export const MOCK_SELLERS: SellerProfile[] = [
  {
    id: "seller-1",
    userId: "user-1",
    displayName: "KeyForge PH",
    rating: 4.9,
    salesCount: 1284,
    responseMinutes: 8,
    verified: true,
    bio: "Instant game keys and top-ups. Escrow-safe delivery.",
  },
  {
    id: "seller-2",
    userId: "user-2",
    displayName: "Arcane Supply",
    rating: 4.7,
    salesCount: 892,
    responseMinutes: 12,
    verified: true,
    bio: "Dota 2 items and Steam wallet codes for SEA region.",
  },
  {
    id: "seller-3",
    userId: "user-3",
    displayName: "LicenseLab",
    rating: 4.8,
    salesCount: 456,
    responseMinutes: 20,
    verified: false,
    bio: "Software licenses with manual verification within 30 minutes.",
  },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "listing-1",
    sellerId: "seller-1",
    title: "Elden Ring Steam Key — Global",
    description:
      "Unused Steam key delivered instantly after escrow confirmation. Region-free activation. Includes receipt for your records.",
    category: "game_key",
    game: "Elden Ring",
    region: "Global",
    deliveryType: "instant_key",
    pricePhp: 1899,
    stock: 12,
    active: true,
    imageHue: 42,
    tags: ["steam", "instant", "rpg"],
    createdAt: "2026-10-01T08:00:00.000Z",
  },
  {
    id: "listing-2",
    sellerId: "seller-2",
    title: "Dota 2 Arcana — Phantom Assassin Manifold Paradox",
    description:
      "Trade-ready item. Seller delivers gift/trade within escrow window. Buyer confirms receipt before payout.",
    category: "in_game_item",
    game: "Dota 2",
    region: "SEA",
    deliveryType: "manual_code",
    pricePhp: 2450,
    stock: 3,
    active: true,
    imageHue: 210,
    tags: ["arcana", "dota2", "trade"],
    createdAt: "2026-10-02T10:30:00.000Z",
  },
  {
    id: "listing-3",
    sellerId: "seller-1",
    title: "Mobile Legends 275 Diamonds Top-up",
    description:
      "Enter your User ID + Zone ID. Diamonds credited within 5–15 minutes after payment is held in escrow.",
    category: "top_up",
    game: "Mobile Legends",
    region: "PH",
    deliveryType: "top_up_uid",
    pricePhp: 499,
    stock: 50,
    active: true,
    imageHue: 165,
    tags: ["mlbb", "top-up", "instant"],
    createdAt: "2026-10-03T14:00:00.000Z",
  },
  {
    id: "listing-4",
    sellerId: "seller-3",
    title: "Windows 11 Pro Retail License",
    description:
      "Genuine retail license key. Manual delivery with activation guide. 7-day escrow dispute window included.",
    category: "software_license",
    game: "Windows",
    region: "Global",
    deliveryType: "manual_code",
    pricePhp: 1299,
    stock: 8,
    active: true,
    imageHue: 260,
    tags: ["windows", "license", "software"],
    createdAt: "2026-10-04T09:15:00.000Z",
  },
  {
    id: "listing-5",
    sellerId: "seller-2",
    title: "Steam Wallet ₱500 Code",
    description:
      "Digital wallet code for Steam PH account. Instant reveal after seller marks delivered.",
    category: "top_up",
    game: "Steam",
    region: "PH",
    deliveryType: "instant_key",
    pricePhp: 500,
    stock: 25,
    active: true,
    imageHue: 28,
    tags: ["steam", "wallet", "instant"],
    createdAt: "2026-10-04T16:45:00.000Z",
  },
  {
    id: "listing-6",
    sellerId: "seller-1",
    title: "Black Myth: Wukong Steam Key",
    description:
      "Brand-new key. Escrow protects your payment until you confirm the key activates on Steam.",
    category: "game_key",
    game: "Black Myth: Wukong",
    region: "Global",
    deliveryType: "instant_key",
    pricePhp: 2199,
    stock: 6,
    active: true,
    imageHue: 15,
    tags: ["steam", "action", "new"],
    createdAt: "2026-10-05T06:00:00.000Z",
  },
];

export function getMockSeller(id: string) {
  return MOCK_SELLERS.find((s) => s.id === id);
}

export function getMockListing(id: string) {
  return MOCK_LISTINGS.find((l) => l.id === id);
}
