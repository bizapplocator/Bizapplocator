import { Router } from "express";
import { SubscriberAuth } from "../controllers/subscriber.controller.ts";
import OauthUtils from "../controllers/auth.controller.ts";
const router: Router = Router();
let sub_auth = new SubscriberAuth();
let oauth_class = new OauthUtils();
router.use((req, res, next) => {
  console.log("HIT SUBSCRIBER ROUTER:", req.method, req.path);
  next();
});
router.post("/register", (req, res) => sub_auth.Register(req, res));
router.post("/login", (req, res) => sub_auth.Login(req, res));

export default router;
