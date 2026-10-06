"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  TriangleAlert,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/loading-spinner";
import { cn } from "cn";

const buyerLinks = [
  { href: "/dashboard/buyer", label: "Purchases", icon: ShoppingBag },
];

const sellerLinks = [
  { href: "/dashboard/seller", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/seller/listings", label: "Listings", icon: Package },
  { href: "/dashboard/seller/orders", label: "Orders", icon: Store },
];

const adminLinks = [{ href: "/admin/disputes", label: "Disputes", icon: TriangleAlert }];

export function DashboardShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "buyer" | "seller" | "admin";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const links =
    role === "admin"
      ? [...buyerLinks, ...sellerLinks, ...adminLinks]
      : role === "seller"
        ? [...buyerLinks, ...sellerLinks]
        : buyerLinks;

  const navigating = pending && pendingHref !== null;

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader className="border-b border-sidebar-border/60 p-4">
          <p className="font-heading text-sm tracking-[0.18em] uppercase">Dashboard</p>
          <p className="text-xs text-muted-foreground">VaultLane trade console</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {links.map((link) => {
                  const isExactSellerRoot = link.href === "/dashboard/seller";
                  const isActive = isExactSellerRoot
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const isPending = pendingHref === link.href;

                  return (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton
                        render={<Link href={link.href} />}
                        isActive={isActive || isPending}
                        onClick={(event) => {
                          if (isActive) return;
                          event.preventDefault();
                          setPendingHref(link.href);
                          startTransition(() => {
                            router.push(link.href);
                          });
                        }}
                      >
                        {isPending && navigating ? (
                          <LoadingSpinner size="sm" className="text-primary" />
                        ) : (
                          <link.icon />
                        )}
                        <span>{link.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <p className="text-sm text-muted-foreground">Manage trades, listings, and escrow</p>
          {navigating && (
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <LoadingSpinner size="sm" className="text-primary" />
              Switching…
            </div>
          )}
        </header>
        <div
          className={cn(
            "relative flex-1 p-4 transition-opacity duration-200 md:p-6",
            navigating && "pointer-events-none opacity-55"
          )}
        >
          {children}
          {navigating && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/25 pt-24 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/90 px-4 py-2 text-sm shadow-sm">
                <LoadingSpinner size="sm" className="text-primary" />
                Loading section…
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
