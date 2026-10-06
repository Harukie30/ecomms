import { Suspense } from "react";
import { PackageOpen } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { BrowseFilters, BrowseMobileFilters } from "@/components/browse-filters";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getFilterOptions, getListings } from "@/lib/queries";
import type { ListingCategory } from "@/lib/types";

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

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:gap-10">
      <Suspense fallback={<Skeleton className="hidden h-[28rem] w-64 xl:block" />}>
        <BrowseFilters games={games} regions={regions} />
      </Suspense>

      <div className="min-w-0 flex-1">
        <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Browse digital goods
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {listings.length} listing{listings.length === 1 ? "" : "s"} available
            </p>
          </div>
          <Suspense fallback={<Skeleton className="h-8 w-24 xl:hidden" />}>
            <BrowseMobileFilters games={games} regions={regions} />
          </Suspense>
        </div>

        {listings.length === 0 ? (
          <Empty className="min-h-[20rem] border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageOpen />
              </EmptyMedia>
              <EmptyTitle>No listings match your filters</EmptyTitle>
              <EmptyDescription>Try clearing filters or search for another game.</EmptyDescription>
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
  );
}
