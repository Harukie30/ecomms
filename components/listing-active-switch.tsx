"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { toggleListingActive } from "@/lib/actions/listings";
import { Switch } from "@/components/ui/switch";

export function ListingActiveSwitch({
  listingId,
  active,
}: {
  listingId: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Switch
      checked={active}
      disabled={pending}
      onCheckedChange={(checked) => {
        startTransition(async () => {
          const result = await toggleListingActive(listingId, checked);
          if (result.error) toast.error(result.error);
        });
      }}
    />
  );
}
