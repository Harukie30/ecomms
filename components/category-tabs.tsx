"use client";

import { useState } from "react";
import { ListingCard } from "@/components/listing-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_LABELS, type Listing, type ListingCategory } from "@/lib/types";

const categoryKeys = Object.keys(CATEGORY_LABELS) as ListingCategory[];

export function CategoryTabs({ listings }: { listings: Listing[] }) {
  const [value, setValue] = useState<ListingCategory>("game_key");
  const items = listings.filter((listing) => listing.category === value).slice(0, 3);

  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        if (next) setValue(next as ListingCategory);
      }}
    >
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight">Shop by category</h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Built for digital commerce, not general retail.
          </p>
        </div>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 sm:w-auto">
          {categoryKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="px-3 transition-colors duration-300">
              {CATEGORY_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div
        key={value}
        className="animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out"
      >
        {items.length === 0 ? (
          <Empty className="border border-dashed py-12">
            <EmptyHeader>
              <EmptyTitle>No {CATEGORY_LABELS[value].toLowerCase()} yet</EmptyTitle>
              <EmptyDescription>
                Check back soon or browse the full marketplace.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((listing, index) => (
              <div
                key={listing.id}
                className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500 ease-out"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Tabs>
  );
}
