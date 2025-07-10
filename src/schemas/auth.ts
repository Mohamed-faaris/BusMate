import { z } from "zod";

// Complete registration API
export const registrationSchema = z.object({
  rollNo: z.string().min(1, "Roll No is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  boardingPoint: z.string().min(1, "Boarding point is required"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const step1Schema = z.object({
  rollNo: z.string().min(1, "Roll No is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  boardingPoint: z.string().min(1, "Boarding point is required"),
});

export const step2Schema = z.object({
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export const step3Schema = z
.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const step4Schema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
  });
