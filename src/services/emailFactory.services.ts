import { Resend } from "resend";

// Initialize Resend with your environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * A factory function that configures who the email comes from,
 * and returns a reusable async function to send custom emails.
 * * @param fromAddress The verified domain sender email (e.g., "auth@yourdomain.com")
 */
export const createEmailSender = (fromAddress: string) => {
  // This is the actual sender function returned by the factory
  return async ({ to, subject, html }: EmailPayload): Promise<boolean> => {
    try {
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error("Resend API Error:", error.message);
        return false;
      }

      console.log(`Email sent successfully! Message ID: ${data?.id}`);
      return true;
    } catch (err) {
      console.error("Failed to execute email dispatch:", err);
      return false;
    }
  };
};
