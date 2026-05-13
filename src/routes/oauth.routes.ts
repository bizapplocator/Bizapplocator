import OauthUtils from "../controllers/auth.controller.ts";
import { Router } from "express";
const router: Router = Router();
router.use((req, res, next) => {
  console.log("HIT AUTH ROUTER:", req.method, req.path);
  next();
});
let oauth_class = new OauthUtils();
router.get("/oauth", (req, res) => {
  console.log("🚨 REDIRECT ROUTE HIT DIRECTLY");
  oauth_class.redirect(res);
});
router.get("/redirect", (req, res) => oauth_class.handle_callback(req, res));
router.get("/finish-signup", (req, res) => oauth_class.finish_signUp(req, res));
export default router;
