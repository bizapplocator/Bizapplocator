import { Router } from "express";
import { type Response, type Request } from "express";

import AdminControl from "../controllers/Admin/admin.controller.ts";
import Auth_middleware from "../middleware/auth.middleware.ts";

const route = Router();
const adminClass = new AdminControl();
const middleware_class = new Auth_middleware();
route.use(middleware_class.admin_auth);
route.get("/totalusers", (req: Request, res: Response) =>
  adminClass.UserCount(req, res),
);
route.get("/totalsub", (req: Request, res: Response) =>
  adminClass.SubCount(req, res),
);
// route.get("/view_reg_sub", (req: Request, res: Response) =>
//   adminClass.view_sub_details(req, res)
// );
export default route;
