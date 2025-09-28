import { generateOTP } from "@/lib/utils";
import { sendOTPMail } from "@/server/mailer";
import { setKey } from "@/server/redis/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const resendOTPSchema = z.object({
  email: z.string().email("Invalid email format"),
});

/**
 * Handle POST requests to resend a one-time password (OTP) to a validated email address.
 *
 * Validates and normalizes the request body, ensures the email is properly formatted, generates
 * an OTP, stores it keyed by `otp:{email}` with a 7-minute expiry, and sends the OTP to the email.
 *
 * @returns On success, a JSON response with `{ message: "OTP sent successfully" }`.
 *          On invalid input, a 400 JSON response with `{ error: "Invalid input", details: [...] }`.
 *          If the email is missing, a 400 JSON response with `{ error: "Email is required" }`.
 *          If the email format is invalid, a 400 JSON response with `{ error: "Invalid email" }`.
 */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json();
  const parseResult = resendOTPSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parseResult.error.errors },
      { status: 400 },
    );
  }
  const { email } = parseResult.data;
  const normalizedEmail = email.toLowerCase();

  if (!normalizedEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const schema = z.string().email();

  try {
    schema.parse(normalizedEmail);
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Generate OTP and send email logic here
  const otp = generateOTP();

  await setKey(`otp:${normalizedEmail}`, otp, 7 * 60);

  await sendOTPMail(normalizedEmail, otp);

  return NextResponse.json({ message: "OTP sent successfully" });
}
