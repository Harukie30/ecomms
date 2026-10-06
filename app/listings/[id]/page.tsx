import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Star } from "lucide-react";
import { auth } from "@/auth";
import { PurchaseDialog } from "@/components/purchase-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatPhp } from "@/lib/format";
import { getListingById, getSellerById } from "@/lib/queries";
import { CATEGORY_LABELS } from "@/lib/types";

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const [listing, session] = await Promise.all([getListingById(id), auth()]);
  if (!listing) notFound();

  const seller = await getSellerById(listing.sellerId);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumb className="mb-6 sm:mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/browse" />}>Browse</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1 max-w-[18rem] sm:max-w-md">
              {listing.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-12">
        <div className="space-y-6">
          <div
            className="relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-border/60 sm:min-h-[360px]"
            style={{
              background: `linear-gradient(135deg, hsl(${listing.imageHue} 50% 20%), hsl(${(listing.imageHue + 35) % 360} 45% 32%))`,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
            <div className="absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-7">
              <Badge>{CATEGORY_LABELS[listing.category]}</Badge>
              <h1 className="max-w-2xl text-2xl font-semibold text-white sm:text-4xl">
                {listing.title}
              </h1>
            </div>
          </div>

          <Tabs defaultValue="description" className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="seller">Seller</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-0 text-sm leading-7 text-muted-foreground">
              {listing.description}
            </TabsContent>
            <TabsContent value="delivery" className="mt-0 text-sm leading-7 text-muted-foreground">
              Delivery type: <strong>{listing.deliveryType.replaceAll("_", " ")}</strong>. Instant
              keys reveal after payment; manual deliveries require seller submission before you
              confirm.
            </TabsContent>
            <TabsContent value="seller" className="mt-0 text-sm leading-7 text-muted-foreground">
              {seller?.bio ?? "Seller profile unavailable."}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="space-y-5 rounded-[1.75rem] border border-border/60 bg-card/40 p-5 sm:p-6">
            <div className="space-y-1.5">
              <p className="text-3xl font-semibold tracking-tight">
                {formatPhp(listing.pricePhp)}
              </p>
              <p className="text-sm text-muted-foreground">
                {listing.game} · {listing.region} · {listing.stock} left
              </p>
            </div>

            <Alert>
              <ShieldCheck />
              <AlertTitle>Escrow protected</AlertTitle>
              <AlertDescription>
                Payment is held until you confirm the digital delivery works.
              </AlertDescription>
            </Alert>

            <PurchaseDialog listing={listing} signedIn={Boolean(session?.user)} />
          </div>

          {seller && (
            <HoverCard>
              <HoverCardTrigger
                render={
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card/30 px-4 py-3.5 text-left transition hover:bg-card/50"
                  />
                }
              >
                <Avatar className="size-10">
                  <AvatarFallback>{seller.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate font-medium">{seller.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {seller.rating}★ · {seller.salesCount} sales
                  </p>
                </div>
                {seller.verified && <Badge variant="secondary">Verified</Badge>}
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-primary" />
                    <span className="font-medium">{seller.displayName}</span>
                    {seller.verified && <Badge variant="secondary">Verified</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{seller.bio}</p>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    Responds in ~{seller.responseMinutes} minutes
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </aside>
      </div>
    </div>
  );
}
