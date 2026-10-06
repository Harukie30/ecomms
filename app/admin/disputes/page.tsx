import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { AdminDisputeActions } from "@/components/admin-dispute-actions";
import { Badge } from "@/components/ui/badge";
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
import { getDisputedOrders } from "@/lib/dashboard-queries";

export default async function AdminDisputesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth");
  if (session.user.role !== "admin") redirect("/dashboard/buyer");

  const disputes = await getDisputedOrders();

  return (
    <DashboardShell role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dispute review</h1>
          <p className="text-muted-foreground">
            Resolve escrow conflicts between buyers and sellers.
          </p>
        </div>

        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open disputes ({disputes.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      No open disputes.
                    </TableCell>
                  </TableRow>
                ) : (
                  disputes.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.listing.title}</TableCell>
                      <TableCell>{order.buyer.name}</TableCell>
                      <TableCell>{order.seller.name}</TableCell>
                      <TableCell>{formatPhp(order.amountPhp)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {order.disputeReason ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Badge variant="destructive">Disputed</Badge>
                          <AdminDisputeActions orderId={order.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
