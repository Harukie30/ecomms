import { auth } from "@/auth";
import { SellerListingDialog } from "@/components/seller-listing-dialog";
import { ListingActiveSwitch } from "@/components/listing-active-switch";
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
import { getSellerListings } from "@/lib/dashboard-queries";
import { CATEGORY_LABELS } from "@/lib/types";

export default async function SellerListingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const listings = await getSellerListings(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Listings</h1>
          <p className="text-muted-foreground">Manage your digital inventory.</p>
        </div>
        <SellerListingDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                No listings yet. Create your first digital listing.
              </TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {CATEGORY_LABELS[listing.category as keyof typeof CATEGORY_LABELS]}
                  </Badge>
                </TableCell>
                <TableCell>{formatPhp(listing.pricePhp)}</TableCell>
                <TableCell>{listing.stock}</TableCell>
                <TableCell>
                  <ListingActiveSwitch listingId={listing.id} active={listing.active} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
