import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { BuyerOrderActions, SellerDeliverForm } from "@/components/order-actions";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatPhp } from "@/lib/format";
import { getOrderById, STATUS_LABELS, statusBadgeVariant } from "@/lib/dashboard-queries";
import type { OrderStatus } from "@/lib/types";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

function escrowProgress(status: OrderStatus) {
  switch (status) {
    case "pending_payment":
      return 20;
    case "escrow_held":
      return 45;
    case "delivered":
      return 75;
    case "completed":
      return 100;
    case "disputed":
      return 60;
    default:
      return 10;
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/auth");

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const isBuyer = order.buyerId === session.user.id;
  const isSeller = order.sellerId === session.user.id;
  if (!isBuyer && !isSeller && session.user.role !== "admin") notFound();

  const status = order.status as OrderStatus;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumb className="mb-6 sm:mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/buyer" />}>Purchases</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Order {order.id.slice(-8)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-8 rounded-[1.75rem] border border-border/60 bg-card/30 p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Badge variant={statusBadgeVariant(status)}>{STATUS_LABELS[status]}</Badge>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">{order.listing.title}</h1>
              <p className="text-muted-foreground">
                {formatPhp(order.amountPhp)} · {order.paymentMethod.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="space-y-1 rounded-xl border border-border/50 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
            <p>
              <span className="text-foreground/80">Buyer:</span> {order.buyer.name}
            </p>
            <p>
              <span className="text-foreground/80">Seller:</span> {order.seller.name}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Escrow progress</span>
            <span className="text-muted-foreground">{escrowProgress(status)}%</span>
          </div>
          <Progress value={escrowProgress(status)} className="h-2" />
        </div>

        {(isBuyer || (isSeller && status === "escrow_held")) && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Actions</p>
            {isBuyer && <BuyerOrderActions orderId={order.id} status={status} />}
            {isSeller && status === "escrow_held" && <SellerDeliverForm orderId={order.id} />}
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <h2 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
            Escrow timeline
          </h2>
          <div className="space-y-3">
            {order.escrowEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-border/50 bg-background/35 px-4 py-3.5"
              >
                <p className="text-sm font-medium capitalize">
                  {event.type.replaceAll("_", " ")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{event.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {order.disputeReason && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3.5 text-sm">
            <p className="font-medium text-destructive">Dispute reason</p>
            <p className="mt-1.5 text-muted-foreground">{order.disputeReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
