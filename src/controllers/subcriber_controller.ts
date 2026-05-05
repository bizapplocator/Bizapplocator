import type { Response, Request } from "express";
import {
  register_schema,
  login_schema,
} from "../schemas/subscribers.schema.ts";

import { PasswordController } from "../utils/password_hashing.ts";
class SubscriberAuth {
  async Register(req: Request, res: Response): Promise<void> {
    try {
      const user_info = register_schema.safeParse(req.body);

      // ✅ Check if validation failed first
      if (!user_info.success) {
        res.status(400).send({
          message: "Invalid request",
          errors: user_info.error.cause,
        });
        return;
      }

      // ✅ Now TypeScript knows user_info.data exists
      const pass_functions = new PasswordController();
      const { name, email, password } = user_info.data;

      // Save to db
      const hash_password = await pass_functions.hashPassword(password);

      res.status(201).send({
        message: "User created successfully",
      });
    } catch (e: any) {
      // This catch block is for unexpected errors, not validation errors
      res.status(500).send({
        message: "Internal server error",
        info: e.message,
      });
    }
  }
  Login(req: Request, res: Response): void {
    let user_info = login_schema.safeParse(req.body);
    if (!user_info.success) {
      res.status(400).send({
        message: "Invalid request",
      });
    }

    res.json({
      message: "This is the login route",
    });
  }
}
export { SubscriberAuth };
