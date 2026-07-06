// emails/resetPasswordEmail.js

export const resetPasswordEmailHtml = (name: string, resetLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: 'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:12px; overflow:hidden;
                 box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        padding: 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; letter-spacing:1px;">
                🔐 Password Reset
              </h1>
              <p style="margin:8px 0 0; color:#a0aec0; font-size:14px;">
                BizAppLocator
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 48px 40px;">
              <p style="margin:0 0 16px; font-size:16px; color:#374151;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 24px; font-size:15px; color:#6b7280; line-height:1.6;">
                We received a request to reset your password. Click the button below
                to create a new password. This link will expire in <strong>1 hour</strong>.
              </p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${resetLink}"
                       style="display:inline-block; padding:14px 36px;
                              background: linear-gradient(135deg, #667eea, #764ba2);
                              color:#ffffff; text-decoration:none;
                              border-radius:8px; font-size:16px;
                              font-weight:600; letter-spacing:0.5px;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fef9c3; border-left:4px solid #f59e0b;
                              border-radius:6px; padding:16px 20px;">
                    <p style="margin:0; font-size:13px; color:#92400e;">
                      ⚠️ If you didn't request this, please ignore this email.
                      Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <p style="margin:24px 0 0; font-size:12px; color:#9ca3af;">
                Button not working? Copy and paste this link into your browser:<br/>
                <a href="${resetLink}" style="color:#667eea; word-break:break-all;">
                  ${resetLink}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:24px 40px; text-align:center;
                        border-top:1px solid #e5e7eb;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                © ${new Date().getFullYear()} Your App Name · All rights reserved
              </p>
              <p style="margin:8px 0 0; font-size:12px; color:#9ca3af;">
                You're receiving this because a password reset was requested for your account.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`;
