"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CATEGORY_LABELS } from "@/lib/types";

const PRICE_MIN = 0;
const PRICE_MAX = 3000;

interface BrowseFiltersProps {
  games: string[];
  regions: string[];
}

function PriceRange({
  minPrice,
  maxPrice,
  onCommit,
}: {
  minPrice: number;
  maxPrice: number;
  onCommit: (min: number, max: number) => void;
}) {
  const [draft, setDraft] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    setDraft([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  return (
    <div className="space-y-3">
      <Label>Price range (PHP)</Label>
      <Slider
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={50}
        value={draft}
        onValueChange={(value) => {
          const range = Array.isArray(value) ? value : [value];
          const nextMin = range[0];
          const nextMax = range[1];
          if (nextMin === undefined || nextMax === undefined) return;
          setDraft([nextMin, nextMax]);
        }}
        onValueCommitted={(value) => {
          const range = Array.isArray(value) ? value : [value];
          const nextMin = range[0];
          const nextMax = range[1];
          if (nextMin === undefined || nextMax === undefined) return;
          onCommit(nextMin, nextMax);
        }}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>₱{draft[0]}</span>
        <span>₱{draft[1]}</span>
      </div>
    </div>
  );
}

function FilterFields({
  games,
  regions,
  params,
  onChange,
  onPriceCommit,
}: {
  games: string[];
  regions: string[];
  params: URLSearchParams;
  onChange: (key: string, value: string | null) => void;
  onPriceCommit: (min: number, max: number) => void;
}) {
  const minPrice = Number(params.get("minPrice") ?? PRICE_MIN);
  const maxPrice = Number(params.get("maxPrice") ?? PRICE_MAX);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          defaultValue={params.get("q") ?? ""}
          placeholder="Game, title, keyword…"
          onBlur={(event) => onChange("q", event.target.value || null)}
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={params.get("category") ?? "all"}
          onValueChange={(value) => onChange("category", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Game</Label>
        <Select
          value={params.get("game") ?? "all"}
          onValueChange={(value) => onChange("game", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All games</SelectItem>
            {games.map((game) => (
              <SelectItem key={game} value={game}>
                {game}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Region</Label>
        <Select
          value={params.get("region") ?? "all"}
          onValueChange={(value) => onChange("region", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PriceRange minPrice={minPrice} maxPrice={maxPrice} onCommit={onPriceCommit} />

      <Separator />

      <div className="space-y-2">
        <Label>Sort</Label>
        <ToggleGroup
          value={[params.get("sort") ?? "newest"]}
          onValueChange={(value) => onChange("sort", value[0] || "newest")}
          className="flex flex-wrap justify-start"
        >
          <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
          <ToggleGroupItem value="price_asc">Price ↑</ToggleGroupItem>
          <ToggleGroupItem value="price_desc">Price ↓</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="instant"
          checked={params.get("instant") === "1"}
          onCheckedChange={(checked) => onChange("instant", checked ? "1" : null)}
        />
        <Label htmlFor="instant" className="text-sm font-normal">
          Instant delivery only
        </Label>
      </div>
    </div>
  );
}

function useBrowseParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`/browse?${params.toString()}`);
  };

  const updatePrice = (min: number, max: number) => {
    const currentMin = Number(searchParams.get("minPrice") ?? PRICE_MIN);
    const currentMax = Number(searchParams.get("maxPrice") ?? PRICE_MAX);
    if (min === currentMin && max === currentMax) return;

    const params = new URLSearchParams(searchParams.toString());
    if (min <= PRICE_MIN) params.delete("minPrice");
    else params.set("minPrice", String(min));
    if (max >= PRICE_MAX) params.delete("maxPrice");
    else params.set("maxPrice", String(max));

    const query = params.toString();
    router.push(query ? `/browse?${query}` : "/browse");
  };

  return { searchParams, updateParam, updatePrice };
}

export function BrowseFilters({ games, regions }: BrowseFiltersProps) {
  const { searchParams, updateParam, updatePrice } = useBrowseParams();

  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <div className="sticky top-24 space-y-1 rounded-2xl border border-border/60 bg-card/40 p-5">
        <h2 className="font-heading text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Filters
        </h2>
        <div className="pt-4">
          <FilterFields
            games={games}
            regions={regions}
            params={searchParams}
            onChange={updateParam}
            onPriceCommit={updatePrice}
          />
        </div>
      </div>
    </aside>
  );
}

export function BrowseMobileFilters({ games, regions }: BrowseFiltersProps) {
  const { searchParams, updateParam, updatePrice } = useBrowseParams();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="xl:hidden">
            <SlidersHorizontal />
            Filters
          </Button>
        }
      />
      <SheetContent side="left" className="w-[min(100%,22rem)] overflow-y-auto px-5">
        <SheetHeader className="px-0 text-left">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 pb-8">
          <FilterFields
            games={games}
            regions={regions}
            params={searchParams}
            onChange={updateParam}
            onPriceCommit={updatePrice}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
