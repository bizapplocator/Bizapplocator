import type { Request, Response, NextFunction } from "express";
import JwtUtil from "../utils/jwt_gen.ts";
import type { JwtPayload } from "jsonwebtoken";
import type { TokenInfo } from "../types/interfaces/interface.ts";
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
      let user = jwt_class.decode(token) as TokenInfo;
      if (user.role == "SUBSCRIBER") {
        req.user = user;
        next();
      }
      res.status(403).send({ message: "Unauthorized access" });
      return;
    } catch (e) {
      res.status(401).send({ message: "Bad request" });
    }
  };
  admin_auth = async (
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
      let user = jwt_class.decode(token) as TokenInfo;
      if (user.role === "ADMIN") {
        req.user = user;
        next();
      }
      res.status(401).send({ message: "Bad request" });
      return;
    } catch (e) {
      res.status(401).send({ message: "Bad request" });
    }
  };
}
export default Auth_middleware;
