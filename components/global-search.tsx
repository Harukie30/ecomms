"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { CATEGORY_LABELS } from "@/lib/types";

const quickLinks = [
  { label: "Browse all listings", href: "/browse" },
  { label: "Game keys", href: "/browse?category=game_key" },
  { label: "Top-ups", href: "/browse?category=top_up" },
  { label: "In-game items", href: "/browse?category=in_game_item" },
  { label: "Software licenses", href: "/browse?category=software_license" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="hidden h-9 w-56 justify-start gap-2 px-3 text-muted-foreground lg:inline-flex"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">Search goods…</span>
        <kbd className="ml-auto rounded border bg-muted/60 px-1.5 py-0.5 text-[10px] font-normal">
          ⌘K
        </kbd>
      </Button>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
        <Search />
        <span className="sr-only">Search</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Search VaultLane">
        <CommandInput placeholder="Search games, keys, top-ups…" />
        <CommandList>
          <CommandEmpty>No results. Try a game name or category.</CommandEmpty>
          <CommandGroup heading="Quick links">
            {quickLinks.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => {
                  router.push(link.href);
                  setOpen(false);
                }}
              >
                {link.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Categories">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <CommandItem
                key={key}
                onSelect={() => {
                  router.push(`/browse?category=${key}`);
                  setOpen(false);
                }}
              >
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
