"use client";

import { LoadingSpinner } from "@/components/loading-spinner";

export function LoadingOverlay({
  show,
  label = "Please wait…",
}: {
  show: boolean;
  label?: string;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/55 backdrop-blur-[2px]">
      <div className="flex min-w-52 flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/90 px-6 py-5 shadow-lg">
        <LoadingSpinner size="lg" className="text-primary" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
