import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { SignUpConfirmDialog } from "./signup-confirm-dialog";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

  const { isLoading, error, reset, signInOrSignUpFlow } = useAuthStore();

  const promptForName = () => {
    // Return a Promise that resolves to the name entered by the user or null if canceled.
    return new Promise<string | null>((resolve) => {
      setShowSignUpDialog(true);

      const handleConfirm = (name: string) => {
        setShowSignUpDialog(false);
        resolve(name);
      };

      const handleCancel = () => {
        setShowSignUpDialog(false);
        resolve(null);
      };

      // Temporarily attach handlers to state so dialog can use them.
      // We'll handle that in JSX below with props.
      // But since this is inside the promise, we'll just pass these to the dialog component below.
      // Alternatively, you can manage this with component state or context.
      // For simplicity, we'll store these in component state.
      setSignUpHandlers({ onConfirm: handleConfirm, onCancel: handleCancel });
    });
  };

  // Store handlers for SignUpConfirmDialog
  const [signUpHandlers, setSignUpHandlers] = useState<{
    onConfirm: (name: string) => void;
    onCancel: () => void;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();

    if (!email || !password) {
      const message = "Email and password are required.";
      useAuthStore.getState().setError(message);
      toast.error(message);
      return;
    }

    try {
      await signInOrSignUpFlow(email, password, promptForName);
      const currentError = useAuthStore.getState().error;

      if (currentError) {
        toast.error(typeof currentError === "string" ? currentError : currentError.message);
      } else {
        toast.success(`Logged in as ${email}`);
        navigate("/");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      console.error("Authentication failed:", message);
      useAuthStore.getState().setError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {typeof error === "string" ? error : error?.message || "An error occurred"}
          </p>
        )}

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Login"}
          </Button>
        </div>
      </form>

      {/* Show signup dialog only when showSignUpDialog is true */}
      {showSignUpDialog && signUpHandlers && (
        <SignUpConfirmDialog
          open={showSignUpDialog}
          onConfirm={signUpHandlers.onConfirm}
          onCancel={signUpHandlers.onCancel}
          message={`No account found for ${email}. Please enter your name to create one.`}
        />
      )}
    </>
  );
}