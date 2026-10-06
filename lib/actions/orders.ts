"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { encryptPayload } from "@/lib/delivery";
import { prisma } from "@/lib/prisma";
import { getListingById } from "@/lib/queries";

const PLATFORM_FEE_RATE = 0.05;

function mockKey(listingTitle: string) {
  const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${segment()}-${segment()}-${segment()}-${listingTitle.slice(0, 4).toUpperCase()}`;
}

export async function createOrder(input: {
  listingId: string;
  paymentMethod: "gcash" | "maya" | "card";
  buyerNote?: string;
}) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Sign in to purchase." };
  }

  const listing = await getListingById(input.listingId);
  if (!listing || !listing.active || listing.stock < 1) {
    return { error: "Listing unavailable." };
  }

  try {
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { id: listing.sellerId },
    });

    if (!sellerProfile) {
      return { error: "Seller not found." };
    }

    const platformFeePhp = Math.round(listing.pricePhp * PLATFORM_FEE_RATE);

    const order = await prisma.order.create({
      data: {
        listingId: listing.id,
        buyerId: session.user.id,
        sellerId: sellerProfile.userId,
        amountPhp: listing.pricePhp,
        platformFeePhp,
        status: "escrow_held",
        paymentMethod: input.paymentMethod,
        paymentRef: `PAY-${Date.now()}`,
        buyerNote: input.buyerNote,
        escrowEvents: {
          create: {
            type: "escrow_held",
            message: "Payment captured and held in VaultLane escrow.",
          },
        },
      },
    });

    await prisma.listing.update({
      where: { id: listing.id },
      data: { stock: { decrement: 1 } },
    });

    if (listing.deliveryType === "instant_key") {
      const plaintext = mockKey(listing.title);
      await prisma.deliveryPayload.create({
        data: {
          orderId: order.id,
          ciphertext: encryptPayload(plaintext),
        },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "delivered" },
      });
      await prisma.escrowEvent.create({
        data: {
          orderId: order.id,
          type: "delivered",
          message: "Digital payload delivered instantly.",
        },
      });
    }

    revalidatePath("/dashboard/buyer");
    revalidatePath("/dashboard/seller");
    revalidatePath(`/orders/${order.id}`);

    return { orderId: order.id };
  } catch {
    return { error: "Could not create order. Run database seed first." };
  }
}

export async function confirmOrder(orderId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized." };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.buyerId !== session.user.id) return { error: "Order not found." };
  if (order.status !== "delivered") return { error: "Order is not ready to confirm." };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "completed" },
  });
  await prisma.escrowEvent.create({
    data: {
      orderId,
      type: "completed",
      message: "Buyer confirmed delivery. Funds released to seller.",
    },
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/seller");
  return { success: true };
}

export async function openDispute(orderId: string, reason: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized." };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.buyerId !== session.user.id) return { error: "Order not found." };
  if (!["delivered", "escrow_held"].includes(order.status)) {
    return { error: "This order cannot be disputed." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "disputed", disputeReason: reason },
  });
  await prisma.escrowEvent.create({
    data: {
      orderId,
      type: "disputed",
      message: reason,
    },
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/admin/disputes");
  return { success: true };
}

export async function sellerDeliverOrder(orderId: string, payload: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized." };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.sellerId !== session.user.id) return { error: "Order not found." };
  if (order.status !== "escrow_held") return { error: "Order is not awaiting delivery." };

  await prisma.deliveryPayload.upsert({
    where: { orderId },
    create: {
      orderId,
      ciphertext: encryptPayload(payload),
    },
    update: {
      ciphertext: encryptPayload(payload),
      deliveredAt: new Date(),
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "delivered" },
  });
  await prisma.escrowEvent.create({
    data: {
      orderId,
      type: "delivered",
      message: "Seller submitted the digital delivery payload.",
    },
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/dashboard/seller");
  return { success: true };
}

export async function revealDelivery(orderId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized." };

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { deliveryPayload: true },
  });

  if (!order || order.buyerId !== session.user.id) return { error: "Order not found." };
  if (!order.deliveryPayload) return { error: "Nothing delivered yet." };

  const { decryptPayload } = await import("@/lib/delivery");
  return { payload: decryptPayload(order.deliveryPayload.ciphertext) };
}
