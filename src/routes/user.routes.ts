import { Router } from "express";
import Auth_middleware from "../middleware/auth.middleware.ts";

const router = Router();
const authBouncer = new Auth_middleware();
router.use(authBouncer.authenticateUser);
