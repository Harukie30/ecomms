"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { resolveDispute } from "@/lib/actions/admin";
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

export function AdminDisputeActions({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition();

  const resolve = (outcome: "refunded" | "completed") => {
    startTransition(async () => {
      const result = await resolveDispute(orderId, outcome);
      if (result.error) toast.error(result.error);
      else toast.success(`Dispute marked ${outcome}.`);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button size="sm" variant="outline" disabled={pending} />}>
        Resolve
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resolve dispute</AlertDialogTitle>
          <AlertDialogDescription>
            Release funds to the seller or refund the buyer. This updates escrow state immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => resolve("refunded")}>Refund buyer</AlertDialogAction>
          <AlertDialogAction onClick={() => resolve("completed")}>Release seller</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
