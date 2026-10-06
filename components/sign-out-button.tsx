"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LoadingOverlay } from "@/components/loading-overlay";
import { LoadingSpinner } from "@/components/loading-spinner";

export function SignOutMenuItem() {
  const [pending, setPending] = useState(false);

  return (
    <>
      <DropdownMenuItem
        disabled={pending}
        onClick={() => {
          setPending(true);
          void signOut({ callbackUrl: "/" });
        }}
      >
        {pending ? (
          <>
            <LoadingSpinner size="sm" />
            Signing out…
          </>
        ) : (
          "Sign out"
        )}
      </DropdownMenuItem>
      <LoadingOverlay show={pending} label="Signing out…" />
    </>
  );
}
