import { Router } from "express";
import type { Response, Request } from "express";
const router: Router = Router();
router.post("/register", (req: Request, res: Response) => {
  res.json({
    message: "Hello from the sub route",
  });
});
export default router;
