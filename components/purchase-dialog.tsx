"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { createOrder } from "@/lib/actions/orders";
import { formatPhp } from "@/lib/format";
import type { Listing } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/loading-spinner";
import { cn } from "cn";

const PAYMENT_METHODS = [
  {
    id: "gcash" as const,
    label: "GCash",
    description: "Pay via GCash wallet",
    logo: "/gcash-logo.png",
  },
  {
    id: "maya" as const,
    label: "Maya",
    description: "Pay via Maya wallet",
    logo: "/mayaa.png",
  },
  {
    id: "card" as const,
    label: "Visa / card",
    description: "Debit or credit card",
    logo: "/visa.png",
  },
];

export function PurchaseDialog({
  listing,
  signedIn,
}: {
  listing: Listing;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"gcash" | "maya" | "card">("gcash");
  const [buyerNote, setBuyerNote] = useState("");
  const [pending, startTransition] = useTransition();

  const fee = Math.round(listing.pricePhp * 0.05);
  const progress = step === 0 ? 33 : step === 1 ? 66 : 100;
  const selectedPayment = PAYMENT_METHODS.find((method) => method.id === paymentMethod);

  const handlePurchase = () => {
    if (!signedIn) {
      router.push("/auth");
      return;
    }

    startTransition(async () => {
      const result = await createOrder({ listingId: listing.id, paymentMethod, buyerNote });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Order placed. Funds held in escrow.");
      setOpen(false);
      router.push(`/orders/${result.orderId}`);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setStep(0);
      }}
    >
      <DialogTrigger
        render={<Button size="lg" className="h-11 w-full" />}
      >
        Buy with escrow
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Secure checkout</DialogTitle>
          <DialogDescription>
            Payment stays in VaultLane escrow until you confirm delivery.
          </DialogDescription>
        </DialogHeader>

        <Progress value={progress} className="h-1.5" />

        {step === 0 && (
          <div className="space-y-4">
            <Alert>
              <ShieldCheck />
              <AlertTitle>Escrow protected</AlertTitle>
              <AlertDescription>
                {formatPhp(listing.pricePhp)} held until the seller delivers your digital goods.
              </AlertDescription>
            </Alert>
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm">
              <p className="font-medium">{listing.title}</p>
              <p className="mt-1 text-muted-foreground">
                Platform fee {formatPhp(fee)} · Seller receives {formatPhp(listing.pricePhp - fee)}
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}
                className="gap-2.5"
              >
                {PAYMENT_METHODS.map((method) => {
                  const selected = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      htmlFor={method.id}
                      className={cn(
                        "relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-3.5 transition-all duration-300",
                        selected
                          ? "border-primary/45 bg-gradient-to-r from-primary/8 via-background to-background ring-1 ring-primary/20"
                          : "border-border/70 hover:bg-muted/35"
                      )}
                    >
                      <Image
                        src={method.logo}
                        alt=""
                        aria-hidden
                        width={160}
                        height={160}
                        className={cn(
                          "pointer-events-none absolute right-0 top-1/2 h-[130%] w-auto max-w-[55%] -translate-y-1/2 object-contain transition-all duration-300 ease-out",
                          selected
                            ? "translate-x-0 scale-100 opacity-[0.28] blur-[0.2px]"
                            : "translate-x-3 scale-90 opacity-0"
                        )}
                      />
                      <span
                        className={cn(
                          "pointer-events-none absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-background/10 to-transparent transition-opacity duration-300",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <RadioGroupItem value={method.id} id={method.id} className="relative z-10" />
                      <span className="relative z-10 min-w-0 flex-1 pr-16">
                        <span className="block text-sm font-medium">{method.label}</span>
                        <span className="block text-xs text-muted-foreground">
                          {method.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note to seller (optional)</Label>
              <Textarea
                id="note"
                value={buyerNote}
                onChange={(event) => setBuyerNote(event.target.value)}
                placeholder="User ID, zone ID, or delivery instructions…"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/30 px-3 py-3">
              {selectedPayment && (
                <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-white">
                  <Image
                    src={selectedPayment.logo}
                    alt={`${selectedPayment.label} logo`}
                    width={44}
                    height={44}
                    className="size-full object-contain p-1"
                  />
                </span>
              )}
              <div>
                <p>
                  Pay <strong>{formatPhp(listing.pricePhp)}</strong> with{" "}
                  <strong>{selectedPayment?.label ?? paymentMethod}</strong>
                </p>
                <p className="mt-1 text-muted-foreground">
                  Funds move to escrow immediately after confirmation.
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Instant listings reveal delivery right after payment. Manual deliveries wait for the
              seller to submit the payload.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={pending}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button onClick={handlePurchase} disabled={pending}>
              {pending ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing…
                </>
              ) : (
                `Pay ${formatPhp(listing.pricePhp)}`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
