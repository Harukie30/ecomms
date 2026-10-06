"use client";

import { useState, useTransition } from "react";
import { Copy, Flag, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  confirmOrder,
  openDispute,
  revealDelivery,
  sellerDeliverOrder,
} from "@/lib/actions/orders";
import type { OrderStatus } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/loading-spinner";

export function BuyerOrderActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [payload, setPayload] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [pending, startTransition] = useTransition();

  const reveal = () => {
    startTransition(async () => {
      const result = await revealDelivery(orderId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setPayload(result.payload ?? null);
    });
  };

  const confirm = () => {
    startTransition(async () => {
      const result = await confirmOrder(orderId);
      if (result.error) toast.error(result.error);
      else toast.success("Delivery confirmed. Escrow released.");
    });
  };

  const dispute = () => {
    startTransition(async () => {
      const result = await openDispute(orderId, disputeReason);
      if (result.error) toast.error(result.error);
      else toast.success("Dispute opened. Admin will review.");
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {["delivered", "completed"].includes(status) && (
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Reveal delivery</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your digital delivery</DialogTitle>
            </DialogHeader>
            {!payload ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the last 4 characters of your order ID to reveal the payload.
                </p>
                <InputOTP maxLength={4}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
                <Button onClick={reveal} disabled={pending}>
                  {pending ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Revealing…
                    </>
                  ) : (
                    "Reveal securely"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <code className="block rounded-xl bg-muted p-4 text-sm break-all">{payload}</code>
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(payload);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy />
                  Copy payload
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {status === "delivered" && (
        <AlertDialog>
          <AlertDialogTrigger render={<Button />}>
            <ShieldCheck />
            Confirm delivery
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Release escrow to seller?</AlertDialogTitle>
              <AlertDialogDescription>
                Only confirm if your digital goods work. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirm}>Confirm & release</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {["delivered", "escrow_held"].includes(status) && (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            <Flag />
            Open dispute
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Open a dispute</AlertDialogTitle>
              <AlertDialogDescription>
                Describe the issue. Funds stay locked until admin review.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea
              value={disputeReason}
              onChange={(event) => setDisputeReason(event.target.value)}
              placeholder="Key invalid, item not received, wrong region…"
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={dispute} disabled={!disputeReason.trim()}>
                Submit dispute
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export function SellerDeliverForm({ orderId }: { orderId: string }) {
  const [payload, setPayload] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      const result = await sellerDeliverOrder(orderId, payload);
      if (result.error) toast.error(result.error);
      else toast.success("Delivery submitted to buyer.");
    });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border/70 bg-card/40 p-4">
      <p className="text-sm font-medium">Submit delivery payload</p>
      <Textarea
        value={payload}
        onChange={(event) => setPayload(event.target.value)}
        placeholder="Key, code, trade link, or top-up confirmation…"
      />
      <Button onClick={submit} disabled={pending || !payload.trim()}>
        {pending ? (
          <>
            <LoadingSpinner size="sm" />
            Submitting…
          </>
        ) : (
          "Mark as delivered"
        )}
      </Button>
    </div>
  );
}
