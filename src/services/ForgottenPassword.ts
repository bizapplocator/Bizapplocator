// services/ForgottenPassword.js

import { Resend } from "resend";
import { resetPasswordEmailHtml } from "../utils/Emails/resetEmailPassword.ts";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(token: string, email: string, name: string) {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Your App <no-reply@yourdomain.com>",
    to: email,
    subject: "Reset Your Password",
    html: resetPasswordEmailHtml(name, resetLink),
  });
}

export { sendResetEmail };
