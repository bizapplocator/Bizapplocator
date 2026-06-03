/** * generatePasswordResetEmail * * @param {Object} params * @param {string}
params.userEmail - Recipient email address * @param {string}
params.userFirstName - Recipient first name (displayed in greeting) * @param
{string} params.code - 6-digit OTP code (e.g. "482910") * @param {string}
* @param {number} params.expiryMinutes -
Minutes until the code expires (e.g. 10) * @returns {string} - Full HTML email
  string, ready to send */
export interface GenResetEmailParams {
  userEmail: string;
  userFirstName: string;
  code: string;
  expiryMinutes: string;
}

function generatePasswordResetEmail({
  userEmail,
  userFirstName,
  code,
  expiryMinutes,
}: GenResetEmailParams) {
  const digits = String(code).padStart(6, "0").split("");
  const [d1, d2, d3, d4, d5, d6] = digits;
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!--<![endif]-->
        <title>Reset Your Password</title>

        <!--[if mso]>
            <noscript
                ><xml
                    ><o:OfficeDocumentSettings
                        ><o:PixelsPerInch
                            >96</o:PixelsPerInch
                        ></o:OfficeDocumentSettings
                    ></xml
                ></noscript
            >
        <![endif]-->

        <style type="text/css">
            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            img {
                -ms-interpolation-mode: bicubic;
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }
            body {
                margin: 0 !important;
                padding: 0 !important;
                background-color: #0d0b1a;
                width: 100% !important;
            }

            @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap");

            @keyframes pulseGlow {
                0%,
                100% {
                    box-shadow: 0 0 0 0 rgba(111, 79, 246, 0.5);
                }
                60% {
                    box-shadow: 0 0 0 14px rgba(111, 79, 246, 0);
                }
            }
            @keyframes shimmer {
                0% {
                    background-position: -400px 0;
                }
                100% {
                    background-position: 400px 0;
                }
            }
            @keyframes flipIn {
                0% {
                    transform: rotateX(-80deg);
                    opacity: 0;
                }
                100% {
                    transform: rotateX(0deg);
                    opacity: 1;
                }
            }

            .digit-cell {
                animation: flipIn 0.5s cubic-bezier(0.22, 0.68, 0, 1.2) both;
            }
            .digit-cell:nth-child(1) {
                animation-delay: 0.1s;
            }
            .digit-cell:nth-child(2) {
                animation-delay: 0.2s;
            }
            .digit-cell:nth-child(3) {
                animation-delay: 0.3s;
            }
            .digit-cell:nth-child(4) {
                animation-delay: 0.45s;
            }
            .digit-cell:nth-child(5) {
                animation-delay: 0.55s;
            }
            .digit-cell:nth-child(6) {
                animation-delay: 0.65s;
            }

            .cta-btn {
                display: inline-block !important;
                background: linear-gradient(
                    135deg,
                    #6f4ff6 0%,
                    #4f35c8 100%
                ) !important;
                border-radius: 14px !important;
                color: #ffffff !important;
                font-family: "Sora", Arial, sans-serif !important;
                font-size: 15px !important;
                font-weight: 700 !important;
                letter-spacing: 0.4px !important;
                padding: 17px 52px !important;
                text-decoration: none !important;
                box-shadow: 0 8px 28px rgba(111, 79, 246, 0.55) !important;
            }

            .logo-box {
                animation: pulseGlow 3s ease-in-out infinite;
                -webkit-animation: pulseGlow 3s ease-in-out infinite;
            }

            @media screen and (max-width: 480px) {
                .email-card {
                    width: 100% !important;
                    border-radius: 0 !important;
                }
                .inner-pad {
                    padding-left: 24px !important;
                    padding-right: 24px !important;
                }
                .digit-box {
                    width: 38px !important;
                    height: 50px !important;
                    font-size: 22px !important;
                }
                .digit-spacer {
                    width: 6px !important;
                }
                .cta-btn {
                    padding: 14px 32px !important;
                    font-size: 14px !important;
                }
            }
        </style>
    </head>

    <body style="margin: 0; padding: 0; background-color: #0d0b1a; width: 100%">
        <table
            role="presentation"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="background-color: #0d0b1a"
        >
            <tr>
                <td align="center" style="padding: 48px 16px 64px">
                    <!-- ░░ CARD ░░ -->
                    <table
                        role="presentation"
                        class="email-card"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="560"
                        style="
                            width: 560px;
                            border-radius: 28px;
                            overflow: hidden;
                            box-shadow:
                                0 0 0 1px rgba(111, 79, 246, 0.25),
                                0 40px 80px rgba(0, 0, 0, 0.6),
                                0 0 120px rgba(111, 79, 246, 0.12);
                            background-color: #12102a;
                        "
                    >
                        <!-- ══ HEADER ══ -->
                        <tr>
                            <td
                                class="inner-pad"
                                align="center"
                                valign="top"
                                style="
                                    background-color: #12102a;
                                    padding: 52px 40px 44px;
                                    background-image:
                                        radial-gradient(
                                            ellipse at 10% 20%,
                                            rgba(111, 79, 246, 0.3) 0%,
                                            transparent 55%
                                        ),
                                        radial-gradient(
                                            ellipse at 90% 80%,
                                            rgba(250, 188, 42, 0.15) 0%,
                                            transparent 50%
                                        ),
                                        radial-gradient(
                                            ellipse at 85% 15%,
                                            rgba(59, 175, 239, 0.15) 0%,
                                            transparent 45%
                                        );
                                "
                            >
                                <!-- Logo -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin: 0 auto 28px"
                                >
                                    <tr>
                                        <td align="center">
                                            <div
                                                class="logo-box"
                                                style="
                                                    width: 80px;
                                                    height: 80px;
                                                    border-radius: 20px;
                                                    background: linear-gradient(
                                                        145deg,
                                                        #1e1a40,
                                                        #2a2260
                                                    );
                                                    box-shadow:
                                                        0 0 0 2px
                                                            rgba(
                                                                111,
                                                                79,
                                                                246,
                                                                0.45
                                                            ),
                                                        0 16px 40px
                                                            rgba(0, 0, 0, 0.5);
                                                    display: inline-block;
                                                    line-height: 80px;
                                                    text-align: center;
                                                "
                                            >
                                                <svg
                                                    width="52"
                                                    height="58"
                                                    viewBox="0 0 52 60"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style="
                                                        display: inline-block;
                                                        vertical-align: middle;
                                                        margin-top: 14px;
                                                    "
                                                >
                                                    <path
                                                        d="M26 1C15.955 1 8 8.955 8 19c0 13.8 18 37 18 37s18-23.2 18-37C44 8.955 36.045 1 26 1z"
                                                        fill="#3d1eb5"
                                                    />
                                                    <path
                                                        d="M26 2C16.507 2 9 9.507 9 19c0 13.5 17 36 17 36s17-22.5 17-36C43 9.507 35.493 2 26 2z"
                                                        fill="#2a1690"
                                                    />
                                                    <rect
                                                        x="15"
                                                        y="10"
                                                        width="9"
                                                        height="9"
                                                        rx="2.5"
                                                        fill="#7c5cf5"
                                                    />
                                                    <rect
                                                        x="26"
                                                        y="10"
                                                        width="9"
                                                        height="9"
                                                        rx="2.5"
                                                        fill="#3d1f9e"
                                                    />
                                                    <rect
                                                        x="15"
                                                        y="21"
                                                        width="9"
                                                        height="9"
                                                        rx="2.5"
                                                        fill="#3bafef"
                                                    />
                                                    <rect
                                                        x="26"
                                                        y="21"
                                                        width="9"
                                                        height="9"
                                                        rx="2.5"
                                                        fill="#fabc2a"
                                                    />
                                                    <ellipse
                                                        cx="26"
                                                        cy="55"
                                                        rx="5"
                                                        ry="2"
                                                        fill="rgba(111,79,246,.3)"
                                                    />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Headline -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin: 0 auto"
                                >
                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                font-family:
                                                    &quot;Sora&quot;, Arial,
                                                    sans-serif;
                                                font-size: 28px;
                                                font-weight: 800;
                                                letter-spacing: -0.5px;
                                                color: #ffffff;
                                                padding-bottom: 10px;
                                            "
                                        >
                                            Password Reset
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                font-family:
                                                    &quot;DM Sans&quot;, Arial,
                                                    sans-serif;
                                                font-size: 15px;
                                                font-weight: 300;
                                                color: rgba(255, 255, 255, 0.5);
                                                line-height: 1.65;
                                                padding-bottom: 22px;
                                            "
                                        >
                                            We received a request to reset your
                                            account password.<br />
                                            Use the verification code below to
                                            continue.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <table
                                                role="presentation"
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                            >
                                                <tr>
                                                    <td
                                                        style="
                                                            width: 60px;
                                                            height: 3px;
                                                            border-radius: 2px;
                                                            background: linear-gradient(
                                                                90deg,
                                                                #6f4ff6,
                                                                #3bafef
                                                            );
                                                            font-size: 0;
                                                            line-height: 0;
                                                        "
                                                    >
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- ══ BODY ══ -->
                        <tr>
                            <td
                                class="inner-pad"
                                style="
                                    background-color: #100e25;
                                    padding: 44px 40px 40px;
                                "
                            >
                                <!-- Greeting -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                >
                                    <tr>
                                        <td
                                            style="
                                                font-family:
                                                    &quot;DM Sans&quot;, Arial,
                                                    sans-serif;
                                                font-size: 18px;
                                                font-weight: 500;
                                                color: #e8e2ff;
                                                padding-bottom: 16px;
                                            "
                                        >
                                            Hello,
                                            <span
                                                style="
                                                    color: #fabc2a;
                                                    font-weight: 600;
                                                "
                                                >${userFirstName}</span
                                            >
                                            &#x1F44B;
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style="
                                                font-family:
                                                    &quot;DM Sans&quot;, Arial,
                                                    sans-serif;
                                                font-size: 15px;
                                                font-weight: 300;
                                                color: rgba(
                                                    220,
                                                    215,
                                                    255,
                                                    0.62
                                                );
                                                line-height: 1.75;
                                                padding-bottom: 36px;
                                            "
                                        >
                                            Someone (hopefully you) requested a
                                            password reset for your account.
                                            Enter the 6-digit verification code
                                            below to continue. If you
                                            didn&rsquo;t make this request, you
                                            can safely ignore this email &mdash;
                                            your account remains secure and no
                                            changes have been made.
                                        </td>
                                    </tr>
                                </table>

                                <!-- ── CODE BLOCK ── -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                        border: 1px solid
                                            rgba(111, 79, 246, 0.3);
                                        border-radius: 20px;
                                        background-color: #0d0b1e;
                                        background-image: linear-gradient(
                                            135deg,
                                            rgba(111, 79, 246, 0.06) 0%,
                                            rgba(59, 175, 239, 0.04) 50%,
                                            rgba(250, 188, 42, 0.04) 100%
                                        );
                                    "
                                >
                                    <tr>
                                        <td
                                            align="center"
                                            style="padding: 32px 24px 28px"
                                        >
                                            <!-- Code label -->
                                            <table
                                                role="presentation"
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                            >
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style="
                                                            font-family:
                                                                &quot;Sora&quot;,
                                                                Arial,
                                                                sans-serif;
                                                            font-size: 11px;
                                                            font-weight: 600;
                                                            letter-spacing: 2.5px;
                                                            color: rgba(
                                                                111,
                                                                79,
                                                                246,
                                                                0.85
                                                            );
                                                            text-transform: uppercase;
                                                            padding-bottom: 20px;
                                                        "
                                                    >
                                                        Your Verification Code
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- 6 Digit cells -->
                                            <table
                                                role="presentation"
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="
                                                    margin: 0 auto;
                                                    padding-bottom: 22px;
                                                "
                                            >
                                                <tr>
                                                    <!-- D1 -->
                                                    <td
                                                        class="digit-cell"
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <table
                                                            role="presentation"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="digit-box"
                                                                    align="center"
                                                                    valign="middle"
                                                                    style="
                                                                        width: 52px;
                                                                        height: 64px;
                                                                        border-radius: 12px;
                                                                        background: linear-gradient(
                                                                            160deg,
                                                                            #1c1840,
                                                                            #130f2e
                                                                        );
                                                                        border: 1.5px
                                                                            solid
                                                                            rgba(
                                                                                111,
                                                                                79,
                                                                                246,
                                                                                0.55
                                                                            );
                                                                        box-shadow:
                                                                            0
                                                                                8px
                                                                                24px
                                                                                rgba(
                                                                                    0,
                                                                                    0,
                                                                                    0,
                                                                                    0.4
                                                                                ),
                                                                            inset
                                                                                0
                                                                                1px
                                                                                0
                                                                                rgba(
                                                                                    255,
                                                                                    255,
                                                                                    255,
                                                                                    0.06
                                                                                );
                                                                        font-family:
                                                                            &quot;Sora&quot;,
                                                                            Arial,
                                                                            sans-serif;
                                                                        font-size: 28px;
                                                                        font-weight: 800;
                                                                        color: #c4b4ff;
                                                                        text-align: center;
                                                                    "
                                                                >
                                                                    ${d1}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="digit-spacer"
                                                        style="width: 8px"
                                                    ></td>

                                                    <!-- D2 -->
                                                    <td
                                                        class="digit-cell"
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <table
                                                            role="presentation"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="digit-box"
                                                                    align="center"
                                                                    valign="middle"
                                                                    style="
                                                                        width: 52px;
                                                                        height: 64px;
                                                                        border-radius: 12px;
                                                                        background: linear-gradient(
                                                                            160deg,
                                                                            #1c1840,
                                                                            #130f2e
                                                                        );
                                                                        border: 1.5px
                                                                            solid
                                                                            rgba(
                                                                                111,
                                                                                79,
                                                                                246,
                                                                                0.55
                                                                            );
                                                                        box-shadow:
                                                                            0
                                                                                8px
                                                                                24px
                                                                                rgba(
                                                                                    0,
                                                                                    0,
                                                                                    0,
                                                                                    0.4
                                                                                ),
                                                                            inset
                                                                                0
                                                                                1px
                                                                                0
                                                                                rgba(
                                                                                    255,
                                                                                    255,
                                                                                    255,
                                                                                    0.06
                                                                                );
                                                                        font-family:
                                                                            &quot;Sora&quot;,
                                                                            Arial,
                                                                            sans-serif;
                                                                        font-size: 28px;
                                                                        font-weight: 800;
                                                                        color: #a78bfa;
                                                                        text-align: center;
                                                                    "
                                                                >
                                                                    ${d2}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="digit-spacer"
                                                        style="width: 8px"
                                                    ></td>

                                                    <!-- D3 -->
                                                    <td
                                                        class="digit-cell"
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <table
                                                            role="presentation"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="digit-box"
                                                                    align="center"
                                                                    valign="middle"
                                                                    style="
                                                                        width: 52px;
                                                                        height: 64px;
                                                                        border-radius: 12px;
                                                                        background: linear-gradient(
                                                                            160deg,
                                                                            #1c1840,
                                                                            #130f2e
                                                                        );
                                                                        border: 1.5px
                                                                            solid
                                                                            rgba(
                                                                                111,
                                                                                79,
                                                                                246,
                                                                                0.55
                                                                            );
                                                                        box-shadow:
                                                                            0
                                                                                8px
                                                                                24px
                                                                                rgba(
                                                                                    0,
                                                                                    0,
                                                                                    0,
                                                                                    0.4
                                                                                ),
                                                                            inset
                                                                                0
                                                                                1px
                                                                                0
                                                                                rgba(
                                                                                    255,
                                                                                    255,
                                                                                    255,
                                                                                    0.06
                                                                                );
                                                                        font-family:
                                                                            &quot;Sora&quot;,
                                                                            Arial,
                                                                            sans-serif;
                                                                        font-size: 28px;
                                                                        font-weight: 800;
                                                                        color: #ffffff;
                                                                        text-align: center;
                                                                    "
                                                                >
                                                                    ${d3}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>

                                                    <!-- Mid dot -->
                                                    <td
                                                        style="
                                                            width: 12px;
                                                            text-align: center;
                                                            vertical-align: middle;
                                                            font-family:
                                                                &quot;Sora&quot;,
                                                                Arial,
                                                                sans-serif;
                                                            font-size: 26px;
                                                            font-weight: 800;
                                                            color: rgba(
                                                                111,
                                                                79,
                                                                246,
                                                                0.4
                                                            );
                                                            padding-bottom: 4px;
                                                        "
                                                    >
                                                        &middot;
                                                    </td>

                                                    <!-- D4 -->
                                                    <td
                                                        class="digit-cell"
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <table
                                                            role="presentation"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="digit-box"
                                                                    align="center"
                                                                    valign="middle"
                                                                    style="
                                                                        width: 52px;
                                                                        height: 64px;
                                                                        border-radius: 12px;
                                                                        background: linear-gradient(
                                                                            160deg,
                                                                            #0f1a2e,
                                                                            #0c1728
                                                                        );
                                                                        border: 1.5px
                                                                            solid
                                                                            rgba(
                                                                                59,
                                                                                175,
                                                                                239,
                                                                                0.5
                                                                            );
                                                                        box-shadow:
                                                                            0
                                                                                8px
                                                                                24px
                                                                                rgba(
                                                                                    0,
                                                                                    0,
                                                                                    0,
                                                                                    0.4
                                                                                ),
                                                                            inset
                                                                                0
                                                                                1px
                                                                                0
                                                                                rgba(
                                                                                    255,
                                                                                    255,
                                                                                    255,
                                                                                    0.06
                                                                                );
                                                                        font-family:
                                                                            &quot;Sora&quot;,
                                                                            Arial,
                                                                            sans-serif;
                                                                        font-size: 28px;
                                                                        font-weight: 800;
                                                                        color: #3bafef;
                                                                        text-align: center;
                                                                    "
                                                                >
                                                                    ${d4}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="digit-spacer"
                                                        style="width: 8px"
                                                    ></td>

                                                    <!-- D5 -->
                                                    <td
                                                        class="digit-cell"
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <table
                                                            role="presentation"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="digit-box"
                                                                    align="center"
                                                                    valign="middle"
                                                                    style="
                                                                        width: 52px;
                                                                        height: 64px;
                                                                        border-radius: 12px;
                                                                        background: linear-gradient(
                                                                            160deg,
                                                                            #0f1a2e,
                                                                            #0c1728
                                                                        );
                                                                        border: 1.5px
                                                                            solid
                                                                            rgba(
                                                                                59,
                                                                                175,
                                                                                239,
                                                                                0.5
                                                                            );
                                                                        box-shadow:
                                                                            0
                                                                                8px
                                                                                24px
                                                                                rgba(
                                                                                    0,
                                                                                    0,
                                                                                    0,
                                                                                    0.4
                                                                                ),
                                                                            inset
                                                                                0
                                                                                1px
                                                                                0
                                                                                rgba(
                                                                                    255,
                                                                                    255,
                                                                                    255,
                                                                                    0.06
                                                                                );
                                                                        font-family:
                                                                            &quot;Sora&quot;,
                                                                            Arial,
                                                                            sans-serif;
                                                                        font-size: 28px;
                                                                        font-weight: 800;
                                                                        color: #7acfff;
                                                                        text-align: center;
                                                                    "
                                                                >
                                                                    ${d5}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="digit-spacer"
                                                        style="width: 8px"
                                                    ></td>

                                                    <!-- D6 -->
                                                    <td
                                                        class="digit-cell"
                                                        align="center"
                                                        valign="middle"
                                                    >
                                                        <table
                                                            role="presentation"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="digit-box"
                                                                    align="center"
                                                                    valign="middle"
                                                                    style="
                                                                        width: 52px;
                                                                        height: 64px;
                                                                        border-radius: 12px;
                                                                        background: linear-gradient(
                                                                            160deg,
                                                                            #1f1600,
                                                                            #191000
                                                                        );
                                                                        border: 1.5px
                                                                            solid
                                                                            rgba(
                                                                                250,
                                                                                188,
                                                                                42,
                                                                                0.5
                                                                            );
                                                                        box-shadow:
                                                                            0
                                                                                8px
                                                                                24px
                                                                                rgba(
                                                                                    0,
                                                                                    0,
                                                                                    0,
                                                                                    0.4
                                                                                ),
                                                                            inset
                                                                                0
                                                                                1px
                                                                                0
                                                                                rgba(
                                                                                    255,
                                                                                    255,
                                                                                    255,
                                                                                    0.06
                                                                                );
                                                                        font-family:
                                                                            &quot;Sora&quot;,
                                                                            Arial,
                                                                            sans-serif;
                                                                        font-size: 28px;
                                                                        font-weight: 800;
                                                                        color: #fabc2a;
                                                                        text-align: center;
                                                                    "
                                                                >
                                                                    ${d6}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Expiry -->
                                            <table
                                                role="presentation"
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                            >
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style="
                                                            font-family:
                                                                &quot;DM Sans&quot;,
                                                                Arial,
                                                                sans-serif;
                                                            font-size: 12px;
                                                            color: rgba(
                                                                255,
                                                                255,
                                                                255,
                                                                0.35
                                                            );
                                                            padding-bottom: 18px;
                                                        "
                                                    >
                                                        &#x23F1;&nbsp; Expires
                                                        in
                                                        <span
                                                            style="
                                                                color: #fabc2a;
                                                                font-weight: 600;
                                                            "
                                                            >${expiryMinutes}
                                                            minutes</span
                                                        >
                                                        &nbsp;&middot;&nbsp;
                                                        Single use only
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <!-- ── END CODE BLOCK ── -->

                                <!-- Spacer -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                >
                                    <tr>
                                        <td
                                            style="
                                                height: 32px;
                                                font-size: 0;
                                                line-height: 0;
                                            "
                                        >
                                            &nbsp;
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA Button -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                >
                                    <tr>
                                        <td
                                            align="center"
                                            style="padding-bottom: 32px"
                                        >
                                            <!--[if mso]>
                                                <v:roundrect
                                                    xmlns:v="urn:schemas-microsoft-com:vml"
                                                    style="
                                                        height: 52px;
                                                        v-text-anchor: middle;
                                                        width: 240px;
                                                    "
                                                    arcsize="27%"
                                                    fillcolor="#6f4ff6"
                                                    stroked="false"
                                                >
                                                    <w:anchorlock />
                                                    <center
                                                        style="
                                                            color: #ffffff;
                                                            font-family:
                                                                Arial,
                                                                sans-serif;
                                                            font-size: 15px;
                                                            font-weight: bold;
                                                        "
                                                    >
                                                        Reset My Password
                                                    </center>
                                                </v:roundrect>
                                            <![endif]-->
                                            <!--[if !mso]><!-->
                                            <!--<![endif]-->
                                        </td>
                                    </tr>
                                </table>

                                <!-- Gradient rule -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                >
                                    <tr>
                                        <td
                                            style="
                                                height: 1px;
                                                font-size: 0;
                                                line-height: 0;
                                                background: linear-gradient(
                                                    90deg,
                                                    transparent,
                                                    rgba(111, 79, 246, 0.28) 30%,
                                                    rgba(59, 175, 239, 0.22) 70%,
                                                    transparent
                                                );
                                                margin-bottom: 32px;
                                            "
                                        >
                                            &nbsp;
                                        </td>
                                    </tr>
                                </table>

                                <!-- Spacer -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                >
                                    <tr>
                                        <td
                                            style="
                                                height: 28px;
                                                font-size: 0;
                                                line-height: 0;
                                            "
                                        >
                                            &nbsp;
                                        </td>
                                    </tr>
                                </table>

                                <!-- ── SECURITY NOTICE ── -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                        border: 1px solid
                                            rgba(250, 188, 42, 0.2);
                                        border-radius: 14px;
                                        background-color: rgba(
                                            250,
                                            188,
                                            42,
                                            0.04
                                        );
                                    "
                                >
                                    <tr>
                                        <td
                                            valign="top"
                                            style="
                                                padding: 16px 0 16px 20px;
                                                width: 32px;
                                            "
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#fabc2a"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style="
                                                    margin-top: 2px;
                                                    display: block;
                                                "
                                            >
                                                <path
                                                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                                                />
                                                <line
                                                    x1="12"
                                                    y1="9"
                                                    x2="12"
                                                    y2="13"
                                                />
                                                <line
                                                    x1="12"
                                                    y1="17"
                                                    x2="12.01"
                                                    y2="17"
                                                />
                                            </svg>
                                        </td>
                                        <td
                                            valign="top"
                                            style="
                                                padding: 16px 20px 16px 12px;
                                                font-family:
                                                    &quot;DM Sans&quot;, Arial,
                                                    sans-serif;
                                                font-size: 13px;
                                                color: rgba(255, 220, 100, 0.7);
                                                line-height: 1.65;
                                            "
                                        >
                                            <strong
                                                style="
                                                    color: #fabc2a;
                                                    font-weight: 600;
                                                "
                                                >Security notice:</strong
                                            >
                                            We will never ask for your password,
                                            credit card, or personal information
                                            via email. This code is valid for
                                            <strong
                                                style="
                                                    color: #fabc2a;
                                                    font-weight: 600;
                                                "
                                                >${expiryMinutes}
                                                minutes</strong
                                            >
                                            and can only be used once. If this
                                            wasn&rsquo;t you, your account is
                                            still safe.
                                        </td>
                                    </tr>
                                </table>

                                <!-- Spacer -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                >
                                    <tr>
                                        <td
                                            style="
                                                height: 32px;
                                                font-size: 0;
                                                line-height: 0;
                                            "
                                        >
                                            &nbsp;
                                        </td>
                                    </tr>
                                </table>

                                <!-- ── HOW TO RESET STEPS ── -->
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                >
                                    <tr>
                                        <td
                                            style="
                                                font-family:
                                                    &quot;Sora&quot;, Arial,
                                                    sans-serif;
                                                font-size: 11px;
                                                font-weight: 700;
                                                letter-spacing: 1.8px;
                                                text-transform: uppercase;
                                                color: rgba(
                                                    255,
                                                    255,
                                                    255,
                                                    0.28
                                                );
                                                padding-bottom: 18px;
                                            "
                                        >
                                            How to Reset
                                        </td>
                                    </tr>

                                    ${[
                                      [
                                        "Copy the 6-digit code",
                                        "shown above or use the button provided.",
                                      ],
                                      [
                                        "Paste it on the reset page",
                                        "into the 6-digit verification field.",
                                      ],
                                      [
                                        "Create a strong new password",
                                        "&#x2014; at least 8 characters with letters, numbers &amp; symbols.",
                                      ],
                                    ]
                                      .map(
                                        ([strong, rest], i) => `
                                        <tr>
                                            <td style="padding-bottom: 14px">
                                                <table
                                                    role="presentation"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                >
                                                    <tr>
                                                        <td
                                                            valign="top"
                                                            style="width: 30px"
                                                        >
                                                            <table
                                                                role="presentation"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                            >
                                                                <tr>
                                                                    <td
                                                                        align="center"
                                                                        valign="middle"
                                                                        style="
                                                                            width: 26px;
                                                                            height: 26px;
                                                                            border-radius: 8px;
                                                                            background: linear-gradient(
                                                                                135deg,
                                                                                #6f4ff6,
                                                                                #3bafef
                                                                            );
                                                                            font-family:
                                                                                'Sora',
                                                                                Arial,
                                                                                sans-serif;
                                                                            font-size: 12px;
                                                                            font-weight: 800;
                                                                            color: #ffffff;
                                                                            text-align: center;
                                                                            line-height: 26px;
                                                                        "
                                                                    >
                                                                        ${i + 1}
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td
                                                            style="
                                                                padding-left: 14px;
                                                                font-family:
                                                                    'DM Sans',
                                                                    Arial,
                                                                    sans-serif;
                                                                font-size: 14px;
                                                                color: rgba(
                                                                    200,
                                                                    195,
                                                                    230,
                                                                    0.62
                                                                );
                                                                line-height: 1.55;
                                                                padding-top: 3px;
                                                            "
                                                        >
                                                            <strong
                                                                style="
                                                                    color: rgba(
                                                                        200,
                                                                        195,
                                                                        230,
                                                                        0.9
                                                                    );
                                                                    font-weight: 500;
                                                                "
                                                            >${strong}</strong>
                                                            ${rest}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    `,
                                      )
                                      .join("")}
                                </table>
                            </td>
                        </tr>

                        <!-- ══ FOOTER ══ -->
                        <tr>
                            <td
                                class="inner-pad"
                                align="center"
                                style="
                                    background-color: #0c0a1f;
                                    padding: 32px 40px 36px;
                                    border-top: 1px solid
                                        rgba(111, 79, 246, 0.12);
                                "
                            >
                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                >
                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                font-family:
                                                    &quot;Sora&quot;, Arial,
                                                    sans-serif;
                                                font-size: 16px;
                                                font-weight: 800;
                                                color: rgba(255, 255, 255, 0.7);
                                                letter-spacing: -0.3px;
                                                padding-bottom: 14px;
                                            "
                                        >
                                            App<span style="color: #6f4ff6"
                                                >Locator</span
                                            >
                                        </td>
                                    </tr>
                                </table>

                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                >
                                    <tr>
                                        <td style="padding: 0 12px">
                                            <a
                                                href="#"
                                                style="
                                                    font-family:
                                                        &quot;DM Sans&quot;,
                                                        Arial, sans-serif;
                                                    font-size: 12px;
                                                    color: rgba(
                                                        255,
                                                        255,
                                                        255,
                                                        0.3
                                                    );
                                                    text-decoration: none;
                                                "
                                                >Help Center</a
                                            >
                                        </td>
                                        <td
                                            style="
                                                font-size: 12px;
                                                color: rgba(
                                                    255,
                                                    255,
                                                    255,
                                                    0.15
                                                );
                                            "
                                        >
                                            &middot;
                                        </td>
                                        <td style="padding: 0 12px">
                                            <a
                                                href="#"
                                                style="
                                                    font-family:
                                                        &quot;DM Sans&quot;,
                                                        Arial, sans-serif;
                                                    font-size: 12px;
                                                    color: rgba(
                                                        255,
                                                        255,
                                                        255,
                                                        0.3
                                                    );
                                                    text-decoration: none;
                                                "
                                                >Privacy Policy</a
                                            >
                                        </td>
                                        <td
                                            style="
                                                font-size: 12px;
                                                color: rgba(
                                                    255,
                                                    255,
                                                    255,
                                                    0.15
                                                );
                                            "
                                        >
                                            &middot;
                                        </td>
                                        <td style="padding: 0 12px">
                                            <a
                                                href="#"
                                                style="
                                                    font-family:
                                                        &quot;DM Sans&quot;,
                                                        Arial, sans-serif;
                                                    font-size: 12px;
                                                    color: rgba(
                                                        255,
                                                        255,
                                                        255,
                                                        0.3
                                                    );
                                                    text-decoration: none;
                                                "
                                                >Terms</a
                                            >
                                        </td>
                                        <td
                                            style="
                                                font-size: 12px;
                                                color: rgba(
                                                    255,
                                                    255,
                                                    255,
                                                    0.15
                                                );
                                            "
                                        >
                                            &middot;
                                        </td>
                                        <td style="padding: 0 12px">
                                            <a
                                                href="#"
                                                style="
                                                    font-family:
                                                        &quot;DM Sans&quot;,
                                                        Arial, sans-serif;
                                                    font-size: 12px;
                                                    color: rgba(
                                                        255,
                                                        255,
                                                        255,
                                                        0.3
                                                    );
                                                    text-decoration: none;
                                                "
                                                >Unsubscribe</a
                                            >
                                        </td>
                                    </tr>
                                </table>

                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin-top: 18px"
                                >
                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                font-family:
                                                    &quot;DM Sans&quot;, Arial,
                                                    sans-serif;
                                                font-size: 12px;
                                                color: rgba(255, 255, 255, 0.2);
                                                line-height: 1.7;
                                                text-align: center;
                                            "
                                        >
                                            &copy; 2026 AppLocator Inc. &middot;
                                            123 Innovation Drive, Tech City, TC
                                            00100<br />
                                            You&rsquo;re receiving this because
                                            a password reset was requested for
                                            <a
                                                href="#"
                                                style="
                                                    color: rgba(
                                                        59,
                                                        175,
                                                        239,
                                                        0.5
                                                    );
                                                    text-decoration: none;
                                                "
                                                >${userEmail}</a
                                            >
                                        </td>
                                    </tr>
                                </table>

                                <table
                                    role="presentation"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="margin-top: 20px"
                                >
                                    <tr>
                                        <td
                                            style="
                                                width: 40px;
                                                height: 2px;
                                                border-radius: 1px;
                                                font-size: 0;
                                                line-height: 0;
                                                background: linear-gradient(
                                                    90deg,
                                                    #6f4ff6,
                                                    #fabc2a
                                                );
                                            "
                                        >
                                            &nbsp;
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
`;
}

export { generatePasswordResetEmail };
