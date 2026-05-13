import type { Request, Response, NextFunction } from "express";
import JwtUtil from "../utils/jwt_gen.ts";
import type { JwtPayload } from "jsonwebtoken";
class Auth_middleware {
  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let jwt_class = new JwtUtil();
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        res.status(401).send({ message: "Bad request sent" });
        return;
      }
      let user = jwt_class.decode(token) as JwtPayload;
      next();
    } catch (e) {
      res.status(401).send({ message: "Bad request" });
    }
  };
}
export default Auth_middleware;
