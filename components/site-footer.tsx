import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/types";

const explore = [
  { href: "/browse", label: "All listings" },
  { href: "/dashboard/seller", label: "Start selling" },
  { href: "/auth", label: "Sign in" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src="/iconns.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-auto object-contain"
            />
            <span className="font-heading text-base tracking-[0.18em] uppercase">VaultLane</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            A marketplace for keys, top-ups, in-game items, and licenses. Payment stays in escrow
            until delivery is confirmed.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            {explore.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-foreground/80 hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Categories
          </p>
          <ul className="space-y-2 text-sm">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <li key={key}>
                <Link
                  href={`/browse?category=${key}`}
                  className="text-foreground/80 hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} VaultLane. Digital goods only. Escrow releases after the
          buyer confirms delivery.
        </p>
      </div>
    </footer>
  );
}
