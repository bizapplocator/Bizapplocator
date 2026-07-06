import Router from "express";
import Auth_middleware from "../middleware/auth.middleware.ts";
const route = Router();

const auth_middleware = new Auth_middleware();
route.use(auth_middleware.authenticate);
