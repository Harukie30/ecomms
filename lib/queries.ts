import { prisma } from "@/lib/prisma";
import { MOCK_LISTINGS, MOCK_SELLERS, getMockListing, getMockSeller } from "@/lib/mock-data";
import type { Listing, ListingCategory, SellerProfile } from "@/lib/types";

function parseTags(tags: string) {
  try {
    return JSON.parse(tags) as string[];
  } catch {
    return [];
  }
}

function mapListing(row: {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  game: string;
  region: string;
  deliveryType: string;
  pricePhp: number;
  stock: number;
  active: boolean;
  imageHue: number;
  tags: string;
  createdAt: Date;
}): Listing {
  return {
    id: row.id,
    sellerId: row.sellerId,
    title: row.title,
    description: row.description,
    category: row.category as ListingCategory,
    game: row.game,
    region: row.region,
    deliveryType: row.deliveryType as Listing["deliveryType"],
    pricePhp: row.pricePhp,
    stock: row.stock,
    active: row.active,
    imageHue: row.imageHue,
    tags: parseTags(row.tags),
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getListings(filters?: {
  q?: string;
  category?: ListingCategory | "all";
  game?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}) {
  try {
    const rows = await prisma.listing.findMany({
      where: {
        active: true,
        ...(filters?.category && filters.category !== "all"
          ? { category: filters.category }
          : {}),
        ...(filters?.game && filters.game !== "all" ? { game: filters.game } : {}),
        ...(filters?.region && filters.region !== "all" ? { region: filters.region } : {}),
        ...(filters?.q
          ? {
              OR: [
                { title: { contains: filters.q } },
                { game: { contains: filters.q } },
                { description: { contains: filters.q } },
              ],
            }
          : {}),
        ...(filters?.minPrice !== undefined || filters?.maxPrice !== undefined
          ? {
              pricePhp: {
                ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
                ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
              },
            }
          : {}),
      },
      orderBy:
        filters?.sort === "price_asc"
          ? { pricePhp: "asc" }
          : filters?.sort === "price_desc"
            ? { pricePhp: "desc" }
            : { createdAt: "desc" },
    });

    if (rows.length > 0) {
      return rows.map(mapListing);
    }
  } catch {
    // fall through to mock data when DB is unavailable
  }

  let listings = MOCK_LISTINGS.filter((l) => l.active);

  if (filters?.category && filters.category !== "all") {
    listings = listings.filter((l) => l.category === filters.category);
  }
  if (filters?.game && filters.game !== "all") {
    listings = listings.filter((l) => l.game === filters.game);
  }
  if (filters?.region && filters.region !== "all") {
    listings = listings.filter((l) => l.region === filters.region);
  }
  if (filters?.q) {
    const q = filters.q.toLowerCase();
    listings = listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.game.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
    );
  }
  if (filters?.minPrice !== undefined) {
    listings = listings.filter((l) => l.pricePhp >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    listings = listings.filter((l) => l.pricePhp <= filters.maxPrice!);
  }

  if (filters?.sort === "price_asc") {
    listings.sort((a, b) => a.pricePhp - b.pricePhp);
  } else if (filters?.sort === "price_desc") {
    listings.sort((a, b) => b.pricePhp - a.pricePhp);
  } else {
    listings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return listings;
}

export async function getListingById(id: string) {
  try {
    const row = await prisma.listing.findUnique({ where: { id } });
    if (row) return mapListing(row);
  } catch {
    // fallback
  }
  return getMockListing(id) ?? null;
}

export async function getSellerById(id: string): Promise<SellerProfile | null> {
  try {
    const row = await prisma.sellerProfile.findUnique({ where: { id } });
    if (row) {
      return {
        id: row.id,
        userId: row.userId,
        displayName: row.displayName,
        rating: row.rating,
        salesCount: row.salesCount,
        responseMinutes: row.responseMinutes,
        verified: row.verified,
        bio: row.bio,
      };
    }
  } catch {
    // fallback
  }
  return getMockSeller(id) ?? null;
}

export async function getFilterOptions() {
  const listings = await getListings();
  return {
    games: [...new Set(listings.map((l) => l.game))].sort(),
    regions: [...new Set(listings.map((l) => l.region))].sort(),
  };
}

export async function getFeaturedListings(limit = 4) {
  const listings = await getListings({ sort: "newest" });
  return listings.slice(0, limit);
}
