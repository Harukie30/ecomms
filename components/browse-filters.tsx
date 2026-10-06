"use client";

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

interface BrowseFiltersProps {
  games: string[];
  regions: string[];
}

function FilterFields({
  games,
  regions,
  params,
  onChange,
}: {
  games: string[];
  regions: string[];
  params: URLSearchParams;
  onChange: (key: string, value: string | null) => void;
}) {
  const minPrice = Number(params.get("minPrice") ?? 0);
  const maxPrice = Number(params.get("maxPrice") ?? 3000);

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

      <div className="space-y-3">
        <Label>Price range (PHP)</Label>
        <Slider
          min={0}
          max={3000}
          step={50}
          value={[minPrice, maxPrice]}
          onValueChange={(value) => {
            const range = Array.isArray(value) ? value : [value];
            if (range[0] !== undefined) onChange("minPrice", String(range[0]));
            if (range[1] !== undefined) onChange("maxPrice", String(range[1]));
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₱{minPrice}</span>
          <span>₱{maxPrice}</span>
        </div>
      </div>

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

export function BrowseFilters({ games, regions }: BrowseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`/browse?${params.toString()}`);
  };

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
          />
        </div>
      </div>
    </aside>
  );
}

export function BrowseMobileFilters({ games, regions }: BrowseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`/browse?${params.toString()}`);
  };

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
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
