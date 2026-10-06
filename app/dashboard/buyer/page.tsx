import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPhp } from "@/lib/format";
import { getBuyerOrders, STATUS_LABELS, statusBadgeVariant } from "@/lib/dashboard-queries";
import type { OrderStatus } from "@/lib/types";

export default async function BuyerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth");

  const orders = await getBuyerOrders(session.user.id);

  const active = orders.filter((o) =>
    ["escrow_held", "delivered", "disputed"].includes(o.status)
  );
  const completed = orders.filter((o) => o.status === "completed");

  const renderTable = (rows: typeof orders) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-muted-foreground">
              No orders yet. Browse listings to start a trade.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.listing.title}</TableCell>
              <TableCell>{formatPhp(order.amountPhp)}</TableCell>
              <TableCell>
                <Badge variant={statusBadgeVariant(order.status as OrderStatus)}>
                  {STATUS_LABELS[order.status as OrderStatus]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  render={<Link href={`/orders/${order.id}`} />}
                  nativeButton={false}
                  size="sm"
                  variant="outline"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <DashboardShell role={session.user.role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Purchases</h1>
          <p className="text-muted-foreground">Track escrow status and confirm deliveries.</p>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active">{renderTable(active)}</TabsContent>
          <TabsContent value="completed">{renderTable(completed)}</TabsContent>
          <TabsContent value="all">{renderTable(orders)}</TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
