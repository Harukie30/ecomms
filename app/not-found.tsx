import Image from "next/image";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-24">
      <Empty className="max-w-lg border border-dashed border-border/60 bg-card/30 px-6 py-12 sm:px-10">
        <EmptyHeader>
          <div className="mb-2 flex size-36 items-center justify-center sm:size-44">
            <Image
              src="/planet.png"
              alt="Lost in space illustration"
              width={176}
              height={176}
              priority
              className="size-full object-contain drop-shadow-sm"
            />
          </div>
          <p className="font-heading text-xs tracking-[0.22em] text-muted-foreground uppercase">
            404
          </p>
          <EmptyTitle className="text-2xl tracking-tight">Page not found</EmptyTitle>
          <EmptyDescription>
            That route doesn’t exist on VaultLane. The listing may have been removed, or the link
            might be outdated.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="flex-row flex-wrap justify-center gap-2">
          <Button
            render={<Link href="/browse" />}
            nativeButton={false}
            size="lg"
            className="h-11 px-5"
          >
            <Search />
            Browse marketplace
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
