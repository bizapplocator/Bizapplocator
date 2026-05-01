import type { Response, Request } from "express";
class SubscriberAuth {
  Register(req: Request, res: Response): void {
    res.json({
      message: "This is the register route",
    });
  }
  Login(req: Request, res: Response): void {
    res.json({
      message: "This is the login route",
    });
  }
}
export { SubscriberAuth };
