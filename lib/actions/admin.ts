"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function resolveDispute(orderId: string, outcome: "refunded" | "completed") {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Admin access required." };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== "disputed") {
    return { error: "Dispute not found." };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: outcome },
  });

  await prisma.escrowEvent.create({
    data: {
      orderId,
      type: outcome,
      message:
        outcome === "refunded"
          ? "Admin refunded buyer and closed dispute."
          : "Admin released escrow to seller and closed dispute.",
    },
  });

  revalidatePath("/admin/disputes");
  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}
