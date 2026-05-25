import { Router } from "express";
import UserCont from "../controllers/User/user.contoller.ts";
import Auth_middleware from "../middleware/auth.middleware.ts";
const router = Router();
const user_controller_class = new UserCont();
const auth_midleware = new Auth_middleware();
router.use(auth_midleware.authenticate);
router.get("/data", (req, res) => user_controller_class.getUserData(req, res));
export default router;
