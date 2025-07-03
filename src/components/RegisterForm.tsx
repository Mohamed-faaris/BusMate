//TODO : use zod and custom models to verify
"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { use, useState } from "react";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

// Boarding point options
const BOARDING_POINTS: { value: string; label: string }[] = [
  { value: "central-bus-stand", label: "Central Bus Stand" },
  { value: "railway-station", label: "Railway Station" },
  { value: "airport", label: "Airport" },
  { value: "city-center", label: "City Center" },
  { value: "university-gate", label: "University Gate" },
  { value: "shopping-mall", label: "Shopping Mall" },
  { value: "bus-depot", label: "Bus Depot" },
  { value: "metro-station", label: "Metro Station" },
  { value: "government-hospital", label: "Government Hospital" },
  { value: "private-hospital", label: "Private Hospital" },
  { value: "college-campus", label: "College Campus" },
  { value: "tech-park", label: "Tech Park" },
  { value: "industrial-area", label: "Industrial Area" },
  { value: "residential-complex", label: "Residential Complex" },
  { value: "temple-area", label: "Temple Area" },
  { value: "market-square", label: "Market Square" },
  { value: "sports-complex", label: "Sports Complex" },
  { value: "library", label: "Central Library" },
  { value: "park-entrance", label: "Park Entrance" },
  { value: "bus-terminal", label: "Interstate Bus Terminal" },
];

const step1Schema = z.object({
  rollNo: z.string().min(1, "Roll No is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  boardingPoint: z.string().min(1, "Boarding point is required"),
});

const step2Schema = z.object({
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

const step3Schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const step4Schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    email: "",
    boardingPoint: "",
    gender: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<any>({});

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    let schema;
    if (step === 1) schema = step1Schema;
    if (step === 2) schema = step2Schema;
    if (step === 3) schema = step3Schema;

    if (schema) {
      const result = schema.safeParse(formData);
      if (!result.success) {
        setErrors(result.error.formErrors.fieldErrors);
        return;
      }
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

    // Validate final step
    const result = step4Schema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.formErrors.fieldErrors);
      return;
    }

    setErrors({});
    // TODO: Handle form submission (send data to server)
    console.log("Form submitted:", formData);
  };

  // Reusable combobox content component
  const ComboboxContent = () => (
    <Command>
      <CommandInput placeholder="Search boarding point..." />
      <CommandList>
        <CommandEmpty>No boarding point found.</CommandEmpty>
        <CommandGroup>
          {BOARDING_POINTS.map((point) => (
            <CommandItem
              key={point.value}
              value={point.value}
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
                  formData.boardingPoint === point.value
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
              {point.label}
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                                ? BOARDING_POINTS.find(
                                    (point) =>
                                      point.value === formData.boardingPoint,
                                  )?.label
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
                                ? BOARDING_POINTS.find(
                                    (point) =>
                                      point.value === formData.boardingPoint,
                                  )?.label
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
              </AnimatePresence>

              <div className="flex justify-between gap-2">
                <AnimatePresence>
                  {step > 1 && (
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
                      <Button type="submit" className="w-full">
                        Create an account
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
      >
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </motion.div>
    </div>
  );
}
