import Link from "next/link";
import { Suspense } from "react";
import { PackageOpen } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { BrowseFilters, BrowseMobileFilters } from "@/components/browse-filters";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getFilterOptions, getListings } from "@/lib/queries";
import { CATEGORY_LABELS, type ListingCategory } from "@/lib/types";

interface BrowsePageProps {
  searchParams: Promise<{
    q?: string;
    category?: ListingCategory | "all";
    game?: string;
    region?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: "newest" | "price_asc" | "price_desc";
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const [{ games, regions }, listings] = await Promise.all([
    getFilterOptions(),
    getListings({
      q: params.q,
      category: params.category,
      game: params.game,
      region: params.region,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort,
    }),
  ]);

  const activeCategory =
    params.category && params.category !== "all" ? CATEGORY_LABELS[params.category] : null;
  const hasFilters = Boolean(
    params.q || params.category || params.game || params.region || params.minPrice || params.maxPrice
  );

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border/50 bg-card/20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                Marketplace
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {activeCategory ?? "Browse digital goods"}
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Keys, top-ups, in-game items, and licenses from sellers. Funds stay in escrow until
                you confirm delivery.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{listings.length}</span>{" "}
                {listings.length === 1 ? "listing" : "listings"}
              </p>
              <Suspense fallback={<Skeleton className="h-8 w-24 xl:hidden" />}>
                <BrowseMobileFilters games={games} regions={regions} />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/browse">
              <Badge variant={!params.category ? "default" : "outline"} className="px-3 py-1">
                All
              </Badge>
            </Link>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Link key={key} href={`/browse?category=${key}`}>
                <Badge
                  variant={params.category === key ? "default" : "outline"}
                  className="px-3 py-1"
                >
                  {label}
                </Badge>
              </Link>
            ))}
            {hasFilters && (
              <Link href="/browse" className="ml-1 text-sm text-primary hover:underline">
                Clear filters
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:gap-10">
        <Suspense fallback={<Skeleton className="hidden h-[28rem] w-64 xl:block" />}>
          <BrowseFilters games={games} regions={regions} />
        </Suspense>

        <div className="min-w-0 flex-1">
          {listings.length === 0 ? (
            <Empty className="min-h-[20rem] border border-dashed bg-card/20">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PackageOpen />
                </EmptyMedia>
                <EmptyTitle>No listings match your filters</EmptyTitle>
                <EmptyDescription>
                  Try another category, or clear filters to see everything.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
