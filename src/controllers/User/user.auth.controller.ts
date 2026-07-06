import type { Response, Request } from "express";
import {
  register_schema,
  login_schema,
} from "../../schemas/request_data.schema.ts";
import { PasswordController } from "../../utils/password_hashing.ts";
import JwtUtil from "../../utils/jwt_gen.ts";
import { prisma } from "../../lib/db.ts";
class SubscriberAuth {
  async Register(req: Request, res: Response): Promise<void> {
    try {
      const user_info = register_schema.safeParse(req.body);
      console.log("Started register route");
      // ✅ Check if validation failed first
      if (!user_info.success) {
        res.status(400).send({
          message: "Invalid request try again",
          errors: user_info.error.cause,
        });
        return;
      }

      console.info("Started register route passed validation");
      // ✅ Now TypeScript knows user_info.data exists
      const pass_functions = new PasswordController();
      const { name, email, password } = user_info.data;

      const user_account = await prisma.accounts.findUnique({
        where: { email },
      });
      if (user_account) {
        res.status(200).send({
          message: "Login to continue",
        });
        return;
      }
      // Save to db
      const hash_password = await pass_functions.hashPassword(password);
      console.log("Started register route creating account");
      const user = await prisma.accounts.create({
        data: {
          name: name,
          email: email,
          password: hash_password,
          role: "USER",
          signInMethod: "LOCAL",
        },
      });
      let jwt_secret: string = process.env["JWT_SECRET"]!;
      let jwt_class = new JwtUtil();
      console.info("Started register route getting jwt");
      let signparams = {
        id: user.id,
        role: user.role,
        expires_in: "15m",
        secret: jwt_secret,
      };
      const refresh_params = {
        id: user.id,
        role: user.role,
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
    } catch (e: any) {
      console.error("FULL ERROR:", e);
      // This catch block is for unexpected errors, not validation errors
      res.status(500).send({
        message: "Internal server",
        info: e.message,
      });
    }
  }
  async Login(req: Request, res: Response): Promise<void> {
    let validation = login_schema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).send({
        message: "Invalid request",
        error: validation.error.flatten,
      });
      return;
    }

    const { email, password } = validation.data;

    try {
      // 2. Check the database for the subscriber
      // Note: In a real app, ensure you verify the hashed password (e.g., using bcrypt)
      const user = await prisma.accounts.findUnique({
        where: { email },
      });
      console.log(user?.password);
      let pass_controller = new PasswordController();
      let password_match = await pass_controller.verifyPassword(
        password,
        user?.password!,
      );
      if (!user || !password_match) {
        res.status(401).json({ message: "Invalid credentials " });
        return;
      }

      // 3. Prepare JWT signing parameters
      const jwt_class = new JwtUtil();
      const jwt_secret = process.env.JWT_SECRET || "your-default-secret";

      const access_params = {
        id: user.id,
        role: user.role,
        expires_in: "15m",
        secret: jwt_secret,
      };

      const refresh_params = {
        id: user.id,
        role: user.role,
        expires_in: "7d",
        secret: jwt_secret,
      };

      // 4. Issue the token
      const token = await jwt_class.sign(access_params);
      const refreshToken = await jwt_class.sign(refresh_params);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // JS can't access it (XSS protection)
        secure: true, // HTTPS only (set false in dev)
        sameSite: "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });
      // 5. Return successful response
      res.status(200).json({
        message: "Login successful",
        token,
      });
      return;
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
}
export { SubscriberAuth };
