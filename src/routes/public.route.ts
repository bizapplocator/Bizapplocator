import { Router } from "express";
import type { Request, Response } from "express";
import { SubscriberAuth } from "../controllers/User/user.auth.controller.ts";
import OauthUtils from "../controllers/auth.controller.ts";
import rateLimit from "express-rate-limit";

import { reset_password_class } from "../controllers/User/reset_password.controller.ts";
const router: Router = Router();
let sub_auth = new SubscriberAuth();
let oauth_class = new OauthUtils();
let reset_pass_class = new reset_password_class();
const public_rate_limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
router.use(public_rate_limit);
router.use((req, res, next) => {
  console.log("HIT SUBSCRIBER ROUTER:", req.method, req.path);
  next();
});
router.post("/register", (req, res) => sub_auth.Register(req, res));
router.post("/login", (req, res) => sub_auth.Login(req, res));
router.post("/find_user", reset_pass_class.find_user);
router.post("/reset_password", reset_pass_class.change_password_handler);

router.get("/test", (req, res) => {
  res.send("Working");
});
export default router;
