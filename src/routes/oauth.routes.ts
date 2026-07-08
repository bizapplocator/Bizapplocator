import OauthUtils from "../controllers/auth.controller.ts";
import { Router } from "express";
import rateLimit from "express-rate-limit";
const router: Router = Router();

const oauth_rate_limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
router.use(oauth_rate_limit);

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
export default router;
