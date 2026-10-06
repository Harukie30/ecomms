"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { DeliveryType, ListingCategory } from "@/lib/types";

export async function upsertListing(input: {
  id?: string;
  title: string;
  description: string;
  category: ListingCategory;
  game: string;
  region: string;
  deliveryType: DeliveryType;
  pricePhp: number;
  stock: number;
  active: boolean;
}) {
  const session = await auth();
  if (!session?.user || !["seller", "admin"].includes(session.user.role)) {
    return { error: "Seller access required." };
  }

  const profile = await prisma.sellerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return { error: "Complete seller onboarding first." };
  }

  const data = {
    title: input.title,
    description: input.description,
    category: input.category,
    game: input.game,
    region: input.region,
    deliveryType: input.deliveryType,
    pricePhp: input.pricePhp,
    stock: input.stock,
    active: input.active,
    tags: JSON.stringify([]),
  };

  if (input.id) {
    const existing = await prisma.listing.findUnique({ where: { id: input.id } });
    if (!existing || existing.sellerId !== profile.id) {
      return { error: "Listing not found." };
    }
    await prisma.listing.update({ where: { id: input.id }, data });
  } else {
    await prisma.listing.create({
      data: {
        sellerId: profile.id,
        imageHue: Math.floor(Math.random() * 360),
        ...data,
      },
    });
  }

  revalidatePath("/dashboard/seller");
  revalidatePath("/browse");
  return { success: true };
}

export async function toggleListingActive(listingId: string, active: boolean) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized." };

  const profile = await prisma.sellerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) return { error: "Seller profile required." };

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.sellerId !== profile.id) return { error: "Listing not found." };

  await prisma.listing.update({ where: { id: listingId }, data: { active } });
  revalidatePath("/dashboard/seller");
  revalidatePath("/browse");
  return { success: true };
}

export async function createSellerProfile(displayName: string, bio: string) {
  const session = await auth();
  if (!session?.user) return { error: "Sign in first." };

  const existing = await prisma.sellerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) return { error: "Seller profile already exists." };

  await prisma.sellerProfile.create({
    data: {
      userId: session.user.id,
      displayName,
      bio,
      verified: false,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: "seller" },
  });

  revalidatePath("/dashboard/seller");
  return { success: true };
}
