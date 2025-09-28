import { generateOTP } from "@/lib/utils";
import { sendOTPMail } from "@/server/mailer";
import { setKey } from "@/server/redis/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sendOTPSchema = z.object({
  email: z.string().email("Invalid email format"),
});

/**
 * Handle POST requests to generate, store, and email a one-time password (OTP) for a validated email address.
 *
 * Validates the request body for an email, normalizes and re-validates the email format, stores the generated OTP under `otp:<email>` with a 7-minute TTL, and sends the OTP to the email address.
 *
 * @returns A JSON NextResponse:
 * - Success: `{ message: "OTP sent successfully" }` with HTTP status 200.
 * - Validation or input errors: an error object with details and HTTP status 400.
 */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json();
  const parseResult = sendOTPSchema.safeParse(body);
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
