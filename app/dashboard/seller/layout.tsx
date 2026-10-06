import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth");

  return (
    <DashboardShell role={session.user.role === "admin" ? "admin" : "seller"}>
      {children}
    </DashboardShell>
  );
}
