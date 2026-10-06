import { cn } from "cn";
import { Spinner } from "@/components/ui/spinner";

export function LoadingSpinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "sm" ? "size-4" : size === "lg" ? "size-8" : "size-5";

  return <Spinner className={cn(sizeClass, className)} />;
}

export function PageLoader({ label = "Loading VaultLane…" }: { label?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-20 sm:px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex size-14 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
          <LoadingSpinner size="lg" className="relative text-primary" />
        </div>
        <div className="space-y-1">
          <p className="font-heading text-xs tracking-[0.2em] text-primary uppercase">VaultLane</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
