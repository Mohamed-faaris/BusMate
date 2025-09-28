"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { motionConfig } from "@/lib/motion";
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { signInSchema } from "@/schemas/auth";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session.status, router]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonState("loading");
    setErrors({});

    try {
      // Validate form data with Zod
      const validatedData = signInSchema.parse(formData);

      const res = await signIn("credentials", {
        ...validatedData,
        redirect: false,
      });

      console.log(res);
      if (!res || res.error) {
        throw new Error(res?.error ?? "Sign in failed");
      }
      // Handle successful submission here
      setButtonState("success");

      // Redirect to dashboard after showing success
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      setButtonState("error");

      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Sign in error:", error);
        setErrors({ general: "An error occurred. Please try again." });
      }

      // Reset to idle after showing error
      setTimeout(() => {
        setButtonState("idle");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    switch (buttonState) {
      case "loading":
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        );
      case "success":
        return (
          <>
            <Check className="mr-2 h-4 w-4" />
            Success!
          </>
        );
      case "error":
        return (
          <>
            <X className="mr-2 h-4 w-4" />
            Error
          </>
        );
      default:
        return "Login";
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your BusMate account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <motion.div
              variants={motionConfig.variants.step}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={motionConfig.transition}
              className="grid gap-6"
            >
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    variants={motionConfig.variants.error}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="rounded bg-red-50 p-2 text-center text-sm text-red-600"
                  >
                    {errors.general}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="csb2363@krce.ac.in"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={errors.email ? "border-red-500" : ""}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        variants={motionConfig.variants.error}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-sm text-red-500"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/* <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        variants={motionConfig.variants.error}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-sm text-red-500"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <Button
                  type="submit"
                  className={cn(
                    "w-full transition-all duration-300",
                    buttonState === "success" &&
                      "bg-green-600 hover:bg-green-700",
                    buttonState === "error" && "bg-red-600 hover:bg-red-700",
                  )}
                  disabled={isLoading}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={buttonState}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      {getButtonContent()}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="underline underline-offset-4"
                >
                  Register
                </Link>
              </div>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
