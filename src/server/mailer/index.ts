import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendOTPMail(email: string, otp: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`Sending OTP ${otp} to ${email}`);
  }
  try {
    await transporter.sendMail({
      from: `\"BusMate\" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">BusMate</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing BusMate. Use the following OTP to complete your Sign Up procedures. OTP is valid for 7 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />BusMate</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>BusMate Inc</p>
        <p>Your Location</p>
      </div>
      </div>
    </div>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
