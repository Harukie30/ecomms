import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, type Listing } from "@/lib/types";
import { formatPhp } from "@/lib/format";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card/70 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.55)]"
    >
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, hsl(${listing.imageHue} 55% 18%), hsl(${(listing.imageHue + 40) % 360} 45% 28%))`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)] transition duration-300 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <Badge variant="secondary" className="bg-black/35 text-white backdrop-blur-sm">
            {CATEGORY_LABELS[listing.category]}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {listing.game} · {listing.region}
          </p>
          <h3 className="line-clamp-2 text-[0.95rem] leading-snug font-medium">{listing.title}</h3>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/50 pt-3">
          <div>
            <p className="text-lg font-semibold tracking-tight">{formatPhp(listing.pricePhp)}</p>
            <p className="text-xs text-muted-foreground">{listing.stock} in stock</p>
          </div>
          <span className="text-sm font-medium text-primary transition group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
