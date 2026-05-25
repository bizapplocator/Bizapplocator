import { type Response, type Request, json } from "express";
import { prisma } from "../lib/db.ts";

class AdminControl {
  async UserCount(req: Request, res: Response) {
    let user_count = await prisma.accounts.count({
      where: {
        role: {
          in: ["SUBSCRIBER", "USER"],
        },
      },
    });
    res.status(200).json({
      users: user_count,
    });
  }
  async SubCount(req: Request, res: Response) {
    let user_count = await prisma.accounts.count({
      where: {
        role: "SUBSCRIBER",
      },
    });
    res.status(200).json({
      users: user_count,
    });
  }
  async subDetails(req: Request, res: Response) {
    let subscriber = await prisma.accounts.findUnique();
  }
}
export default AdminControl;
