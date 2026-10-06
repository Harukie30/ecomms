"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerUser } from "@/lib/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/loading-overlay";
import { LoadingSpinner } from "@/components/loading-spinner";

export function AuthForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"login" | "register" | null>(null);
  const [login, setLogin] = useState({ email: "buyer@vaultlane.test", password: "password123" });
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer" as "buyer" | "seller",
  });

  const handleLogin = () => {
    setAction("login");
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: login.email,
        password: login.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password.");
        setAction(null);
        return;
      }
      toast.success("Welcome back.");
      router.push("/dashboard/buyer");
      router.refresh();
    });
  };

  const handleRegister = () => {
    setAction("register");
    startTransition(async () => {
      const result = await registerUser(register);
      if (result.error) {
        toast.error(result.error);
        setAction(null);
        return;
      }
      await signIn("credentials", {
        email: register.email,
        password: register.password,
        redirect: false,
      });
      toast.success("Account created.");
      router.push(register.role === "seller" ? "/dashboard/seller" : "/dashboard/buyer");
      router.refresh();
    });
  };

  return (
    <>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="login" disabled={pending}>
            Sign in
          </TabsTrigger>
          <TabsTrigger value="register" disabled={pending}>
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account access</CardTitle>
              <CardDescription>Use a demo account or your own credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>Demo: buyer@vaultlane.test · password123</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={login.email}
                  disabled={pending}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={login.password}
                  disabled={pending}
                  onChange={(e) => setLogin({ ...login, password: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleLogin} disabled={pending}>
                {pending && action === "login" ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Create account</CardTitle>
              <CardDescription>Join as a buyer, or check seller to list goods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={register.name}
                  disabled={pending}
                  onChange={(e) => setRegister({ ...register, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={register.email}
                  disabled={pending}
                  onChange={(e) => setRegister({ ...register, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={register.password}
                  disabled={pending}
                  onChange={(e) => setRegister({ ...register, password: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="seller-role"
                  checked={register.role === "seller"}
                  disabled={pending}
                  onCheckedChange={(checked) =>
                    setRegister({ ...register, role: checked ? "seller" : "buyer" })
                  }
                />
                <Label htmlFor="seller-role" className="font-normal">
                  Register as seller
                </Label>
              </div>
              <Button className="w-full" onClick={handleRegister} disabled={pending}>
                {pending && action === "register" ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LoadingOverlay
        show={pending}
        label={action === "register" ? "Creating your account…" : "Signing you in…"}
      />
    </>
  );
}
