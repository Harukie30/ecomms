import Link from "next/link";
import { auth } from "@/auth";
import { SellerListingDialog } from "@/components/seller-listing-dialog";
import { SellerSalesChart } from "@/components/seller-sales-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhp } from "@/lib/format";
import {
  getSellerListings,
  getSellerOrders,
  STATUS_LABELS,
  statusBadgeVariant,
} from "@/lib/dashboard-queries";
import type { OrderStatus } from "@/lib/types";

export default async function SellerDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [orders, listings] = await Promise.all([
    getSellerOrders(session.user.id),
    getSellerListings(session.user.id),
  ]);

  const revenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.amountPhp - o.platformFeePhp), 0);

  const chartData = [
    { week: "W1", sales: Math.round(revenue * 0.15) || 1200 },
    { week: "W2", sales: Math.round(revenue * 0.22) || 1800 },
    { week: "W3", sales: Math.round(revenue * 0.28) || 2400 },
    { week: "W4", sales: Math.round(revenue * 0.35) || revenue || 3200 },
  ];

  const pendingDelivery = orders.filter((o) => o.status === "escrow_held");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Seller overview</h1>
          <p className="text-muted-foreground">Listings, orders, and escrow payouts.</p>
        </div>
        <SellerListingDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active listings
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {listings.filter((l) => l.active).length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{pendingDelivery.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatPhp(revenue)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales trend</CardTitle>
        </CardHeader>
        <CardContent>
          <SellerSalesChart data={chartData} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-medium">Recent orders</h2>
        {orders.slice(0, 5).map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center justify-between rounded-xl border border-border/70 bg-card/30 px-4 py-3 transition hover:bg-card/50"
          >
            <div>
              <p className="font-medium">{order.listing.title}</p>
              <p className="text-sm text-muted-foreground">Buyer: {order.buyer.name}</p>
            </div>
            <div className="text-right">
              <Badge variant={statusBadgeVariant(order.status as OrderStatus)}>
                {STATUS_LABELS[order.status as OrderStatus]}
              </Badge>
              <p className="mt-1 text-sm">{formatPhp(order.amountPhp)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
