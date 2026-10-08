"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { GlobalSearch } from "@/components/global-search";
import { SignOutMenuItem } from "@/components/sign-out-button";
import type { UserRole } from "@/lib/types";

const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/dashboard/buyer", label: "Purchases" },
  { href: "/dashboard/seller", label: "Sell" },
];

interface SiteHeaderProps {
  user?: {
    name: string;
    email: string;
    role: UserRole;
  } | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" />}
          >
            <Menu />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 px-4">
            <SheetHeader className="px-0 text-left">
              <SheetTitle className="flex items-center gap-2.5 font-heading tracking-[0.2em] uppercase">
                <Image
                  src="/iconns.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
                VaultLane
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted ${
                    pathname.startsWith(link.href) ? "bg-muted font-medium" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Separator className="my-4" />
              <Link
                href="/auth"
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
              >
                {user ? "Account" : "Sign in"}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/iconns.png"
            alt="VaultLane"
            width={40}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
          <span className="font-heading text-base tracking-[0.18em] uppercase sm:text-lg">
            VaultLane
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground ${
                pathname.startsWith(link.href) ? "bg-muted font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <GlobalSearch />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const root = document.documentElement;
              root.classList.add("theme-transition");
              window.setTimeout(() => root.classList.remove("theme-transition"), 500);
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
          >
            <span className="relative flex size-4 items-center justify-center">
              <Sun
                className={`absolute size-4 transition-all duration-300 ease-out ${
                  mounted && resolvedTheme === "dark"
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-75 -rotate-90 opacity-0"
                }`}
              />
              <Moon
                className={`absolute size-4 transition-all duration-300 ease-out ${
                  mounted && resolvedTheme === "dark"
                    ? "scale-75 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                }`}
              />
            </span>
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="gap-2 pl-1.5 pr-2">
                    <Avatar className="size-7">
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-28 truncate text-sm sm:inline">{user.name}</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-0.5">
                      <span>{user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<Link href="/dashboard/buyer" />}>
                    Purchases
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/dashboard/seller" />}>
                    Seller dashboard
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem render={<Link href="/admin/disputes" />}>
                      Admin disputes
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <SignOutMenuItem />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              render={<Link href="/auth" />}
              nativeButton={false}
              size="sm"
              className="ml-1"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
