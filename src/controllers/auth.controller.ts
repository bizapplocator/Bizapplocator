// Redirect user to Google OAuth URL
// Catch the code at /callback
// Use reqwest to exchange code for tokens with Google
// Parse the JSON, get the user's email, name, Google ID
// Create or find the user in your Postgres DB
// Issue your own JWT with jsonwebtoken
// Done
import "dotenv/config";
import { prisma } from "../lib/db.ts";
import redisClient from "../redis.ts";
import JwtUtil from "../utils/jwt_gen.ts";
import type { Response, Request } from "express";
class OauthUtils {
  async get_user_data(access_code: string) {
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_code}` },
      },
    );
    const { email, name, id: google_id } = await userRes.json();
    return { email, name, google_id };
  }
  async redirect(res: Response) {
    console.log("started redirect func ");
    //setting state cookie to prevent csrf attack forgery attack
    const state = crypto.randomUUID();
    // Set it as a cookie
    res.cookie("oauth_state", state, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes is enough
      sameSite: "lax",
    });
    await redisClient.set(`oauth_state:${state}`, state, { EX: 3600 });
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL!, // e.g. http://localhost:3000/auth/redirect
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline", // gives you refresh token
      prompt: "consent",
      state,
    });
    const google_url = `${process.env.GOOGLE_AUTH_URL}?${params.toString()}`;
    console.log("Redirecting to:", google_url);
    res.redirect(302, google_url);
  }

  async handle_callback(req: Request, res: Response) {
    try {
      const { state, code, error } = req.query as {
        state?: string;
        code?: string;
        error?: string;
      };

      // 1. Intercept OAuth Errors from the Provider
      if (error) {
        return res
          .status(400)
          .json({ message: `OAuth Provider Error: ${error}` });
      }

      if (!state || !code) {
        return res
          .status(400)
          .json({ message: "Missing state or code configuration parameters" });
      }

      // 2. Anti-CSRF Token Match Validation
      const cookie_state = req.cookies.oauth_state;
      if (!cookie_state || state !== cookie_state) {
        return res
          .status(400)
          .json({ message: "Invalid or expired state token" });
      }

      const expected_state = await redisClient.get(
        `oauth_state:${cookie_state}`,
      );
      if (!expected_state || state !== expected_state) {
        return res.status(400).json({ message: "State mismatch" });
      }

      // Cleanup ephemeral states immediately
      await redisClient.del(`oauth_state:${cookie_state}`);
      res.clearCookie("oauth_state");

      // 3. Spec-Compliant Token Exchange
      const tokenParams = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
        grant_type: "authorization_code",
      });

      const exchange = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenParams.toString(),
      });

      if (!exchange.ok) throw new Error("Failed token validation with Google");
      const { access_token } = await exchange.json();

      // 4. Fetch Core Identity Claims from Google Engine
      const userRes = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );
      if (!userRes.ok)
        throw new Error("Failed to fetch user profiles from Google");
      const { email, name } = await userRes.json();

      // 5. Atomic Postgres Ingestion via Prisma (Find or Create)
      // Use an upsert configuration or findUnique to ensure you don't break unique constraints if they sign in twice!
      let user = await prisma.accounts.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.accounts.create({
          data: {
            name,
            email,
            password: null,
            role: "USER",
            signInMethod: "Google",
          },
        });
      }

      // 6. Security Token Compilation & Cookies Setup
      const jwt_class = new JwtUtil();
      const jwt_secret = process.env.JWT_SECRET!;

      const refreshToken = await jwt_class.sign({
        id: user.id,
        role: user.role,
        expires_in: "7d",
        secret: jwt_secret,
      });

      const accessToken = await jwt_class.sign({
        id: user.id,
        role: user.role,
        expires_in: "15m",
        secret: jwt_secret,
      });

      // Ship refresh token inside deep httpOnly cookies infrastructure
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // Force HTTPS on production systems
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
      });

      // 7. Direct UI Redirect carrying access token payload safely
      return res.status(201).json({
        message: "Authentication lifecycle successful",
        token: accessToken,
      });
    } catch (e: any) {
      console.error("Critical OAuth Handler Crash:", e.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default OauthUtils;
