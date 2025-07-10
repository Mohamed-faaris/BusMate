import { isDev } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Email validation schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get email
    const body = await request.json();
    
    // Validate the email
    const validationResult = emailSchema.safeParse(body);


    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid email", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // If email is valid, return 200 status
    return NextResponse.json(
      { 
        message: "Email is valid",
        email: validationResult.data.email 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }
}
