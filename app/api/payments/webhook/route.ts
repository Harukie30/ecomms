import { NextResponse } from "next/server";
import { handlePaymentWebhook, type PaymentWebhookEvent } from "@/lib/payments/webhook";

export async function POST(request: Request) {
  const secret = request.headers.get("x-vaultlane-webhook-secret");
  if (secret !== process.env.PAYMENT_WEBHOOK_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let event: PaymentWebhookEvent;
  try {
    event = (await request.json()) as PaymentWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await handlePaymentWebhook(event);
  if ("error" in result && result.error) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
