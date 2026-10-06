import { prisma } from "@/lib/prisma";

export type PaymentWebhookEvent =
  | { type: "payment.captured"; paymentRef: string; orderId: string }
  | { type: "payment.failed"; paymentRef: string; orderId: string };

/**
 * Process provider webhooks and transition order escrow states.
 * Wire this to GCash/Maya/card webhook routes in production.
 */
export async function handlePaymentWebhook(event: PaymentWebhookEvent) {
  const order = await prisma.order.findUnique({ where: { id: event.orderId } });
  if (!order) return { error: "Order not found." };

  if (event.type === "payment.captured") {
    await prisma.order.update({
      where: { id: event.orderId },
      data: { status: "escrow_held", paymentRef: event.paymentRef },
    });
    await prisma.escrowEvent.create({
      data: {
        orderId: event.orderId,
        type: "escrow_held",
        message: "Payment provider confirmed capture. Funds held in escrow.",
      },
    });
    return { success: true };
  }

  await prisma.order.update({
    where: { id: event.orderId },
    data: { status: "cancelled", paymentRef: event.paymentRef },
  });
  await prisma.escrowEvent.create({
    data: {
      orderId: event.orderId,
      type: "cancelled",
      message: "Payment failed at provider.",
    },
  });
  return { success: true };
}
