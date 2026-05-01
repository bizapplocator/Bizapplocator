import { Router } from "express";
import { SubscriberAuth } from "../controllers/subcriber_controller.ts";
const router: Router = Router();
let sub_auth = new SubscriberAuth();
router.post("/register", sub_auth.Register);
router.post("/login", sub_auth.Login);
export default router;
