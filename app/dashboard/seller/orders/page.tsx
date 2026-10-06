import Link from "next/link";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPhp } from "@/lib/format";
import { getSellerOrders, STATUS_LABELS, statusBadgeVariant } from "@/lib/dashboard-queries";
import type { OrderStatus } from "@/lib/types";

export default async function SellerOrdersPage() {
  const session = await auth();
  if (!session?.user) return null;

  const orders = await getSellerOrders(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Seller orders</h1>
        <p className="text-muted-foreground">Deliver digital goods and track escrow release.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Listing</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Order</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                No orders yet.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.listing.title}</TableCell>
                <TableCell>{order.buyer.name}</TableCell>
                <TableCell>{formatPhp(order.amountPhp)}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(order.status as OrderStatus)}>
                    {STATUS_LABELS[order.status as OrderStatus]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/orders/${order.id}`} className="text-primary hover:underline">
                    Open
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
