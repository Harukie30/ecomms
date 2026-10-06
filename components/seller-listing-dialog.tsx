"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { upsertListing } from "@/lib/actions/listings";
import { CATEGORY_LABELS, type DeliveryType, type ListingCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function SellerListingDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "game_key" as ListingCategory,
    game: "",
    region: "PH",
    deliveryType: "instant_key" as DeliveryType,
    pricePhp: 499,
    stock: 1,
    active: true,
  });

  const submit = () => {
    startTransition(async () => {
      const result = await upsertListing(form);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Listing saved.");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus />
        New listing
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create digital listing</DialogTitle>
          <DialogDescription>
            List keys, top-ups, in-game items, or licenses for escrow trading.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm({ ...form, category: value as ListingCategory })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Delivery</Label>
              <Select
                value={form.deliveryType}
                onValueChange={(value) =>
                  setForm({ ...form, deliveryType: value as DeliveryType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant_key">Instant key</SelectItem>
                  <SelectItem value="manual_code">Manual code</SelectItem>
                  <SelectItem value="top_up_uid">Top-up UID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="game">Game / product</Label>
              <Input
                id="game"
                value={form.game}
                onChange={(e) => setForm({ ...form, game: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (PHP)</Label>
              <Input
                id="price"
                type="number"
                value={form.pricePhp}
                onChange={(e) => setForm({ ...form, pricePhp: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border p-3">
            <div>
              <p className="text-sm font-medium">Active listing</p>
              <p className="text-xs text-muted-foreground">Visible on browse immediately</p>
            </div>
            <Switch
              checked={form.active}
              onCheckedChange={(active) => setForm({ ...form, active })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={pending || !form.title || !form.game}>
            Publish listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
