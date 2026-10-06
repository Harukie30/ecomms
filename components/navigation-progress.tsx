"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "cn";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setActive(true);
    setVisible(true);

    const done = window.setTimeout(() => setActive(false), 450);
    const hide = window.setTimeout(() => setVisible(false), 700);

    return () => {
      window.clearTimeout(done);
      window.clearTimeout(hide);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden"
    >
      <div
        className={cn(
          "h-full origin-left bg-primary transition-transform duration-500 ease-out",
          active ? "scale-x-100" : "scale-x-0"
        )}
        style={{ transformOrigin: "0% 50%" }}
      />
    </div>
  );
}
