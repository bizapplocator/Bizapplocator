import OauthUtils from "../controllers/oauth_controller.ts";
import { Router } from "express";
const router: Router = Router();
router.use((req, res, next) => {
  console.log("HIT AUTH ROUTER:", req.method, req.path);
  next();
});
let oauth_class = new OauthUtils();
router.get("/oauth", (req, res) => oauth_class.redirect(res));
router.get("/redirect", (req, res) => oauth_class.handle_callback(req, res));
export default router;
