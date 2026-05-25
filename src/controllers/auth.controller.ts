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
      const { state, code } = req.query as { state: string; code: string };
      console.log(state);
      const cookie_state = req.cookies.oauth_state;
      if (!req.query.state || !req.query.iss) {
        console.warn("Rejected malformed OAuth callback", req.query);
        return res.status(400).send("Invalid OAuth callback");
      }
      console.log(cookie_state);
      console.log(state);
      if (!state || state !== cookie_state) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
      const expected_state = await redisClient.get(
        `oauth_state:${cookie_state}`,
      );
      if (state !== expected_state) {
        res.status(400).send({
          message: "Bad request to server",
        });
        return;
      }
      await redisClient.del(`oauth_state:${cookie_state}`);
      res.clearCookie("oauth_state");
      let exchange = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
          grant_type: "authorization_code",
        }),
      });
      let { access_token } = await exchange.json();
      let redis_access = crypto.randomUUID();
      await redisClient.set(`token:${redis_access}`, access_token, {
        EX: 3600,
      });
      console.log(redis_access);
      res.redirect(`/auth/finish-signup?code=${redis_access}`);
    } catch (e: unknown) {
      res.status(500).json({
        message: "Internal server error",
      });
      console.log("error this is the exchange code error");
    }
  }
  async finish_signUp(req: Request, res: Response) {
    try {
      let access_token = req.query.code as string;
      console.log(access_token);
      let redis_access_token = await redisClient.get(`token:${access_token}`);
      let user_info = await this.get_user_data(redis_access_token!);
      let { name, email } = user_info;
      console.log(user_info);
      let create_user = await prisma.accounts.create({
        data: {
          name: name,
          email: email,
          password: null,
          role: "USER",
          signInMethod: "Google",
        },
      });
      let jwt_secret: string = process.env["JWT_SECRET"]!;
      let jwt_class = new JwtUtil();
      console.info("Started register route getting jwt");
      let signparams = {
        id: create_user.id,
        role: create_user.role,
        expires_in: "15m",
        secret: jwt_secret,
      };
      const refresh_params = {
        id: create_user.id,
        role: create_user.role,
        expires_in: "7d",
        secret: jwt_secret,
      };
      const refreshToken = await jwt_class.sign(refresh_params);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // JS can't access it (XSS protection)
        secure: true, // HTTPS only (set false in dev)
        sameSite: "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });
      let token = await jwt_class.sign(signparams);
      res.status(201).send({
        message: "User created successfully",
        token: token,
      });
    } catch (e) {
      res.status(400).send({
        message: "Internal server error",
        error: e,
      });
    }
  }
}

export default OauthUtils;
