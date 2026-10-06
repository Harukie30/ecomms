import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-20">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1.5 text-center">
          <p className="font-heading text-xs tracking-[0.22em] text-primary uppercase">
            VaultLane
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to buy, sell, and track escrow trades.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
