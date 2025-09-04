import { generateOTP } from "@/lib/utils";
import { sendOTPMail } from "@/server/mailer";
import { setKey } from "@/server/redis/utils";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request:NextRequest){
    const {email} = await request.json();
    const normalizedEmail = email.toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const schema = z.string().email();

    try {
        schema.parse(normalizedEmail);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Generate OTP and send email logic here
    const otp = generateOTP();

    setKey(`otp:${normalizedEmail}`, otp, 7 * 60);

    await sendOTPMail(normalizedEmail, otp);

    return NextResponse.json({ message: 'OTP sent successfully' });
}


