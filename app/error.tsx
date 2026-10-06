"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
      <Empty className="max-w-lg border border-dashed border-border/60 bg-card/30 px-6 py-12 sm:px-10">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
            <TriangleAlert />
          </EmptyMedia>
          <EmptyTitle className="text-2xl tracking-tight">Something went wrong</EmptyTitle>
          <EmptyDescription>
            VaultLane hit an unexpected error while loading this page. You can try again, or head
            back to the marketplace.
          </EmptyDescription>
        </EmptyHeader>

        {error.digest && (
          <p className="rounded-lg border border-border/50 bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
            Ref: {error.digest}
          </p>
        )}

        <EmptyContent className="flex-row flex-wrap justify-center gap-2">
          <Button onClick={reset} size="lg" className="h-11 px-5">
            <RefreshCw />
            Try again
          </Button>
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="h-11 px-5"
          >
            <Home />
            Back home
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
