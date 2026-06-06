import { Router } from "express";
import type { Request, Response } from "express";
import { SubscriberAuth } from "../controllers/User/user.auth.controller.ts";
import OauthUtils from "../controllers/auth.controller.ts";
import { reset_password_class } from "../controllers/User/reset_password.controller.ts";
const router: Router = Router();
let sub_auth = new SubscriberAuth();
let oauth_class = new OauthUtils();
let reset_pass_class = new reset_password_class();
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
