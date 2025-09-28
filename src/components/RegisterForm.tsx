//TODO : use zod and custom models to verify
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { motionConfig } from "@/lib/motion";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { BoardingPoint } from "@/app/api/busRoutes/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { step1Schema, step2Schema, step3Schema } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";

export function RegisterForm({
  boardingPoints,
  className,
  ...props
}: {
  boardingPoints: BoardingPoint[];
} & React.ComponentProps<"div">) {
  const router = useRouter();
  const session = useSession();
  if (session.status === "authenticated") {
    router.push("/dashboard");
  }
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    email: "",
    college: "",
    boardingPoint: "",
    gender: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string | string[]>>({});

  // Zod validation will run on each step change
  // React Query mutations for OTP verify and resend via API routes
  const resendOtpMutation = useMutation({
    mutationFn: () =>
      fetch("/api/register/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          rollNo: formData.rollNo,
        }),
      }).then(async (res) => {
        const data = await res.json() as { error?: string; [key: string]: unknown };
        if (!res.ok) {
          // Throw the entire data object to preserve buttonMessage
          const error = new Error(data.error ?? "Failed to send OTP");
          (error as Error & { data: typeof data }).data = data;
          throw error;
        }
        return data;
      }),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () =>
      fetch("/api/register/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          (({ confirmPassword: _confirmPassword, ...rest }) => rest)(formData),
        ),
      }).then(async (res) => {
        const data = await res.json() as { error?: string; [key: string]: unknown };
        if (!res.ok) {
          // Throw the entire data object to preserve buttonMessage
          const error = new Error(data.error ?? "Invalid OTP");
          (error as Error & { data: typeof data }).data = data;
          throw error;
        }
        return data;
      }),
  });

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    let schema;
    if (step === 1) schema = step1Schema;
    if (step === 2) schema = step2Schema;
    if (step === 3) schema = step3Schema;

    if (schema) {
      const result = schema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string | string[]> = {};
        for (const [key, value] of Object.entries(result.error.formErrors.fieldErrors)) {
          if (value && value.length > 0) {
            fieldErrors[key] = value.length === 1 ? value[0] : value;
          }
        }
        setErrors(fieldErrors);
        return;
      }
    }
    if (step === 3) {
      resendOtpMutation.mutate();
    }
    setErrors({});
    setStep(step + 1);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Keep original submit logic (for future use). Currently not triggered for OTP step.
    console.log("Form submit invoked", formData);
  };

  const handleVerifyOtp = () => {
    verifyOtpMutation.mutate(formData.otp);
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate();
  };

  // Reusable combobox content component
  const ComboboxContent = () => (
    <Command>
      <CommandInput placeholder="Search boarding point..." />
      <CommandList>
        <CommandEmpty>No boarding point found.</CommandEmpty>
        <CommandGroup>
          {boardingPoints.map((point) => (
            <CommandItem
              key={point.id}
              value={point.id}
              onSelect={(currentValue) => {
                setFormData((prev) => ({
                  ...prev,
                  boardingPoint:
                    currentValue === formData.boardingPoint ? "" : currentValue,
                }));
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  formData.boardingPoint === point.id
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
              {point.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>
            Enter your details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={motionConfig.variants.step}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={motionConfig.transition}
                    className="grid gap-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="rollNo">Roll No</Label>
                      <Input
                        id="rollNo"
                        placeholder="CSB2363"
                        required
                        value={formData.rollNo}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.rollNo && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.rollNo}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Vinayak S"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="csb2363@krce.ac.in"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="college">College</Label>
                      <Select
                        required
                        value={formData.college}
                        onValueChange={(value) =>
                          handleSelectChange("college", value)
                        }
                      >
                        <SelectTrigger id="college" className="w-full">
                          <SelectValue placeholder="Select college..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KRCE">KRCE</SelectItem>
                          <SelectItem value="KRCT">KRCT</SelectItem>
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {errors.college && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.college}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="boardingPoint">Boarding Point</Label>
                      {isDesktop ? (
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between"
                            >
                              {formData.boardingPoint
                                ? boardingPoints.find(
                                    (point) =>
                                      point.id === formData.boardingPoint,
                                  )?.name
                                : "Select boarding point..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <ComboboxContent />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Drawer open={open} onOpenChange={setOpen}>
                          <DrawerTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between"
                            >
                              {formData.boardingPoint
                                ? boardingPoints.find(
                                    (point) =>
                                      point.id === formData.boardingPoint,
                                  )?.name
                                : "Select boarding point..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Select Boarding Point</DrawerTitle>
                            </DrawerHeader>
                            <div className="px-4 pb-4">
                              <ComboboxContent />
                            </div>
                          </DrawerContent>
                        </Drawer>
                      )}
                      <AnimatePresence>
                        {errors.boardingPoint && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.boardingPoint}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={motionConfig.variants.step}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={motionConfig.transition}
                    className="grid gap-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        required
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                      >
                        <SelectTrigger id="gender" className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {errors.gender && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.gender}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="123, Main Street, Trichy"
                        required
                        value={formData.address}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.address && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.address}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.dateOfBirth && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.dateOfBirth}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={motionConfig.variants.step}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={motionConfig.transition}
                    className="grid gap-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={motionConfig.variants.step}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={motionConfig.transition}
                    className="grid gap-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="otp">OTP</Label>
                      <Input
                        id="otp"
                        placeholder="123456"
                        required
                        value={formData.otp}
                        onChange={handleChange}
                      />
                      <AnimatePresence>
                        {errors.otp && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-red-500"
                          >
                            {errors.otp}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Resend OTP button */}
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          resendOtpMutation.isPending ||
                          resendOtpMutation.isSuccess
                        }
                        onClick={handleResendOtp}
                        className="w-full text-sm"
                      >
                        {resendOtpMutation.isPending && (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resending...
                          </>
                        )}
                        {resendOtpMutation.isError &&
                          (((resendOtpMutation.error as Error & { data?: { buttonMessage?: string } })?.data
                            ?.buttonMessage) ??
                            "Error")}
                        {resendOtpMutation.isSuccess && "OTP Sent"}
                        {!resendOtpMutation.isPending &&
                          !resendOtpMutation.isSuccess &&
                          !resendOtpMutation.isError &&
                          "Resend OTP"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between gap-2">
                <AnimatePresence>
                  {step > 1 && step < 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                      >
                        Back
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {step < 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1"
                    >
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="w-full"
                      >
                        Next
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1"
                    >
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={
                          verifyOtpMutation.isPending ||
                          verifyOtpMutation.isSuccess
                        }
                        className={cn(
                          "w-full transition-all duration-300",
                          verifyOtpMutation.isSuccess &&
                            "bg-green-600 hover:bg-green-700",
                          verifyOtpMutation.isError &&
                            "bg-red-600 hover:bg-red-700",
                        )}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={verifyOtpMutation.status}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center"
                          >
                            {verifyOtpMutation.isIdle && "Verify OTP"}
                            {verifyOtpMutation.isPending && (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            )}
                            {verifyOtpMutation.isSuccess &&
                              (() => {
                                signIn("credentials", {
                                  email: formData.email,
                                  password: formData.password,
                                  redirect: false,
                                })
                                  .then((res) => {
                                    if (res?.ok) {
                                      router.push("/dashboard");
                                    }
                                  })
                                  .catch(() => {
                                    router.push("/auth/signIn");
                                  });
                                return "Success! Redirecting to dashboard...";
                              })()}
                            {verifyOtpMutation.isError &&
                              (((verifyOtpMutation.error as Error & { data?: { buttonMessage?: string } })?.data
                                ?.buttonMessage) ??
                                "Error! Try Again")}
                          </motion.span>
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/auth/signIn" className="underline">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      <motion.div
        variants={motionConfig.variants.fadeUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
      >
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </motion.div>
    </div>
  );
}
