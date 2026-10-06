import { prisma } from "@/lib/prisma";
import { STATUS_LABELS, type OrderStatus } from "@/lib/types";

export async function getBuyerOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { buyerId: userId },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getSellerOrders(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { sellerId: userId },
      include: { listing: true, buyer: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getSellerListings(userId: string) {
  try {
    const profile = await prisma.sellerProfile.findUnique({ where: { userId } });
    if (!profile) return [];
    return await prisma.listing.findMany({
      where: { sellerId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getOrderById(orderId: string) {
  try {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        listing: { include: { seller: true } },
        buyer: true,
        seller: true,
        deliveryPayload: true,
        escrowEvents: { orderBy: { createdAt: "asc" } },
      },
    });
  } catch {
    return null;
  }
}

export async function getDisputedOrders() {
  try {
    return await prisma.order.findMany({
      where: { status: "disputed" },
      include: { listing: true, buyer: true, seller: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export function statusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case "completed":
      return "default" as const;
    case "delivered":
      return "secondary" as const;
    case "escrow_held":
      return "outline" as const;
    case "disputed":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export { STATUS_LABELS };
