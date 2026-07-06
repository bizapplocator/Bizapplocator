// Here is the step-by-step blueprint you need to build a secure password reset system into your application:

// ### Step 1: Create the Database Schema

// You need a table (or collection) to store the temporary tokens. Add a `PasswordReset` model to your database (e.g., in your Prisma schema) with these fields:

// * `userId`: Connected to the user requesting the reset.
// * `token`: A long, unique string (use a UUID or a crypto-random string).
// * `expiresAt`: A timestamp set to 15–60 minutes in the future.
// * `used`: A boolean flag (defaults to `false`).

// ### Step 2: Build the "Forgot Password" Request Endpoint

// Create a backend API route (e.g., `POST /api/auth/forgot-password`) that:

// 1. Accepts the user's email.
// 2. Checks if the email exists in your database (if it doesn't, return a generic success message anyway so hackers can't fish for valid emails).
// 3. Generates a random token and saves it to your `PasswordReset` table with an expiration time.
// 4. Generates a unique link: `https://yourdomain.com/reset-password?token=YOUR_TOKEN`.

// ### Step 3: Integrate an Email Service

// Use a service like Resend, SendGrid, or Postmark in your backend to email that unique link safely to the user's inbox.

// ### Step 4: Build the Frontend Reset Page

// Create a page in your frontend app (e.g., `/reset-password`) that:

// 1. Extracts the `token` from the URL query parameters when the page loads.
// 2. Displays a form with "New Password" and "Confirm New Password" inputs.
// 3. Submits the token and the new password to your backend.

// ### Step 5: Build the "Update Password" Endpoint

// Create a final backend API route (e.g., `POST /api/auth/reset-password`) that receives the token and the new password:

// 1. Looks up the token in your database.
// 2. Validates that the token exists, `used` is `false`, and `expiresAt` is still in the future.
// 3. Hashes (encrypts) the new password using a library like `bcrypt` or `argon2`.
// 4. Updates the user's password in the main user table.
// 5. Marks the token as `used: true` (or deletes it completely) so it can never be reused.
//
import {
  reset_req,
  change_password_schema,
  otpSchema,
} from "../../schemas/request_data.schema.ts";
import crypto from "crypto";
import type { Request, Response } from "express";
import { prisma } from "../../lib/db.ts";
import { PasswordController } from "../../utils/password_hashing.ts";
import type { UserInfo } from "../../types/interfaces/interface.ts";
import { createEmailSender } from "../../services/emailFactory.services.ts";
import type { EmailPayload } from "../../services/emailFactory.services.ts";
import { generatePasswordResetEmail } from "../../templates/reset.templates.ts";
import type { GenResetEmailParams } from "../../templates/reset.templates.ts";

export class reset_password_class {
  reset_password = async (req: Request, res: Response) => {
    let user_details = reset_req.safeParse(req.body);
    if (user_details.error) {
      res.status(400).send({
        message: "Bad request sent",
      });
      return;
    }
    let { email } = user_details.data;
    try {
      let user = await this.find_user_utility(email);
      if (!user) {
        res.status(200).send({
          message:
            "If an account exists with that email, an OTP has been sent.",
        });
        return;
      }
      res.status(200).send({
        message: "If an account exists with that email, an OTP has been sent.",
      });
      return;
    } catch (e: any) {
      if (e.message === "Invalid Data" || e.message === "Bad otp code") {
        return res.status(400).send({ message: e.message });
      }
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  };
  change_password_handler = async (req: Request, res: Response) => {
    const password_payload = change_password_schema.safeParse(req.body);
    if (password_payload.error) {
      res.status(400).send({
        message: "Bad request",
      });
      return;
    }
    let { email, password, code } = password_payload.data;
    try {
      const findUser = await this.find_user_utility(email);
      if (findUser) {
        const change_pass = await this.password_change(
          findUser.id,
          password,
          code.code,
        );
        const db_cleanup = this;
        if (change_pass) {
          res.status(200).send({
            message: "Password change successfull",
          });
        }
      }
    } catch (e) {
      res.status(500).send({
        message: "Internal server error",
      });
      return;
    }
  };
  find_user_utility = async (email: string): Promise<UserInfo | null> => {
    // Prisma findUnique returns the user object if found, or null if not found
    const user = await prisma.accounts.findUnique({
      where: { email: email },
    });
    if (!user) return null;

    // Type cast the object so TypeScript knows it matches UserInfo
    return user as UserInfo;
  };
  find_user = async (req: Request, res: Response) => {
    const email_validation = reset_req.safeParse(req.body);
    if (email_validation.error) {
      res.status(400).send({
        message: "Bad request",
      });
      return;
    }
    // Prisma findUnique returns the user object if found, or null if not found
    const user = await prisma.accounts.findUnique({
      where: { email: email_validation.data.email },
    });
    if (user) {
      const durationInMinutes = 15;
      const expires_at = new Date(Date.now() + durationInMinutes * 60 * 1000);
      const otp_code = await this.generate_otp(user.id, expires_at);
      let email_send = await this.send_email(
        user.email,
        otp_code,
        expires_at.toDateString(),
      );
    }
    res.status(200).send({
      message:
        "If User was found email has been sent pls do well to check your inbox",
    });
    return;
  };
  password_change = async (
    id: string,
    password: string,
    code: string,
  ): Promise<UserInfo | null> => {
    let pass_control = new PasswordController();
    let hashed_password = await pass_control.hashPassword(password);
    let validate_code = otpSchema.safeParse({ id, code });
    if (validate_code.error) {
      throw new Error("Invalid Data");
    }

    try {
      let otp_verification = await this.verifyOtp(id, validate_code.data.code);
      if (!otp_verification.success) {
        throw new Error("Bad otp code");
      }
      const db_cleanup = await this.db_cleanup(id);

      let change_user_password: UserInfo = await prisma.accounts.update({
        where: {
          id: id,
        },
        data: {
          password: hashed_password,
        },
      });
      // Return the updated user object to your controller
      return change_user_password;
    } catch (error: any) {
      if (error.code === "P2025") {
        return null;
      }
      throw error;
    }
  };
  generate_otp = async (user_id: string, expires_at: Date) => {
    try {
      await prisma.otpVerification.updateMany({
        where: {
          userId: user_id,
          used: false,
        },
        data: {
          used: true,
        },
      });
      // 1. Generates a cryptographically secure random number between 100000 and 999999
      const otpCode = crypto.randomInt(100000, 999999).toString();

      // 2. Define the expiration window (e.g., 15 minutes from right now)

      // 3. Save it to your Prisma OtpVerification table
      await prisma.otpVerification.create({
        data: {
          code: otpCode,
          expiresAt: expires_at,
          userId: user_id,
          used: false, // Explicitly set false, matching your schema default
        },
      });

      // 4. Return the raw code so your controller can hand it off to your email service
      return otpCode;
    } catch (e) {
      console.log("Otp generation function failed");
      throw new Error("Otp error");
    }
  };
  send_email = async (
    email_address: string,
    otp: string,
    expiryTime: string,
  ) => {
    try {
      let domain_auth = process.env.EMAIL_ADDRESS_AUTH!;
      const emailFunc = createEmailSender(domain_auth);
      let genParams: GenResetEmailParams = {
        userEmail: email_address,
        userFirstName: email_address.split("@").join(),
        code: otp,
        expiryMinutes: expiryTime,
      };
      let email_param: EmailPayload = {
        to: email_address,
        subject: "Password reset mail",
        html: generatePasswordResetEmail(genParams),
      };
      let email_sender_status = await emailFunc(email_param);
      if (email_sender_status) {
        return true;
      }
      return false;
    } catch (e) {
      throw Error("Send email function failed ");
    }
  };
  verifyOtp = async (userId: string, code: string) => {
    const now = new Date();

    // Find the valid OTP record
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        userId: userId,
        code: code,
        used: false, // Must not be used
        expiresAt: { gt: now }, // Must not be expired
      },
    });

    if (!otpRecord) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    // Mark as used so it cannot be reused
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    return { success: true, message: "OTP verified successfully" };
  };
  db_cleanup = async (userId: string) => {
    try {
      const deletedCount = await prisma.otpVerification.deleteMany({
        where: {
          userId: userId,
          OR: [
            { used: true }, // Already used
            { expiresAt: { lt: new Date() } }, // Expired
          ],
        },
      });

      return deletedCount;
    } catch (e) {
      console.log("Db cleanup error", e);
      throw new Error("Db cleanup not done yet");

      // This removes all expired OR already used OTPs for a specific user
    }
  };
}
