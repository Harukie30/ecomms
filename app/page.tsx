import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { CategoryTabs } from "@/components/category-tabs";
import { ListingCard } from "@/components/listing-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFeaturedListings, getListings } from "@/lib/queries";
import { MOCK_SELLERS } from "@/lib/mock-data";

export default async function Home() {
  const [featured, allListings] = await Promise.all([
    getFeaturedListings(4),
    getListings({ sort: "newest" }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_60%)]" />
        <div className="relative mx-auto grid min-h-[min(88vh,760px)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="flex max-w-xl flex-col gap-7">
            <p className="font-heading text-sm tracking-[0.32em] text-primary uppercase">
              VaultLane
            </p>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Trade digital goods with buyers and sellers you can trust.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Keys, top-ups, in-game items, and licenses — held in escrow until delivery is
              confirmed.
            </p>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button
                render={<Link href="/browse" />}
                nativeButton={false}
                size="lg"
                className="h-12 px-6"
              >
                Browse marketplace
                <ArrowRight />
              </Button>
              <Button
                render={<Link href="/dashboard/seller" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="h-12 px-6"
              >
                Start selling
              </Button>
            </div>
          </div>

          <div className="hero-visual relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] border border-border/50 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)] lg:aspect-auto lg:min-h-[440px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_45%),linear-gradient(135deg,oklch(0.28_0.06_250),oklch(0.42_0.12_195))]" />
            <div className="absolute inset-0 bg-[url('/window.svg')] bg-cover bg-center opacity-20 mix-blend-screen" />
            <div className="absolute inset-x-0 bottom-0 space-y-1.5 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-6 pt-16 pb-6 text-white">
              <p className="text-[11px] tracking-[0.22em] uppercase opacity-75">Live trade floor</p>
              <p className="text-xl font-medium sm:text-2xl">Instant keys · Manual trades · Top-ups</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">Featured listings</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Fresh digital inventory from verified sellers.
            </p>
          </div>
          <Button
            render={<Link href="/browse" />}
            nativeButton={false}
            variant="ghost"
            className="shrink-0"
          >
            View all
            <ArrowRight />
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/50 bg-card/25 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <CategoryTabs listings={allListings} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Why VaultLane</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
              Escrow and delivery built for digital trades.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <ShieldCheck className="size-5" />
                </span>
                <div className="space-y-1">
                  <p className="font-medium">Escrow on every trade</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Payment stays locked until the buyer confirms the digital delivery.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Zap className="size-5" />
                </span>
                <div className="space-y-1">
                  <p className="font-medium">Instant or manual delivery</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Keys can reveal instantly; trades and top-ups follow seller delivery steps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Trusted sellers</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Ratings and response times you can scan quickly.
            </p>
            <div className="mt-8 space-y-3">
              {MOCK_SELLERS.map((seller) => (
                <div
                  key={seller.id}
                  className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card/35 px-4 py-3.5"
                >
                  <Avatar className="size-10">
                    <AvatarFallback>{seller.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="truncate font-medium">{seller.displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {seller.rating}★ · {seller.salesCount.toLocaleString()} sales · ~
                      {seller.responseMinutes}m
                    </p>
                  </div>
                  {seller.verified && <Badge className="shrink-0">Verified</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-card/25 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
            <p className="text-sm text-muted-foreground">
              Quick answers before your first trade.
            </p>
          </div>
          <Accordion className="mt-8">
            <AccordionItem value="escrow">
              <AccordionTrigger>How does escrow work?</AccordionTrigger>
              <AccordionContent>
                When you buy, funds are held by VaultLane. The seller delivers the digital payload.
                You confirm receipt to release payment, or open a dispute if something is wrong.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="goods">
              <AccordionTrigger>What can I sell here?</AccordionTrigger>
              <AccordionContent>
                Game keys, top-ups, in-game items, and software licenses. No physical goods or
                account sales in this MVP.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payments">
              <AccordionTrigger>Which payments are supported?</AccordionTrigger>
              <AccordionContent>
                GCash, Maya, and cards are wired in the checkout UI. Connect your payment provider
                in production to capture real funds.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
