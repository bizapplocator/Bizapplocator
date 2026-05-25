import { prisma } from "../../lib/db.ts";
import type { Response, Request } from "express";

class UserCont {
  getUserData = async (req: Request, res: Response) => {
    try {
      // 1. Get the ID from where you stored it in the middleware
      // If your middleware did req.user = user, then user_uuid is likely req.user.id
      const user_uuid = req.user?.id;

      if (!user_uuid) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }

      // 2. Use the correct variable name in the query
      const details = await prisma.accounts.findUnique({
        where: {
          id: user_uuid, // Changed from 'id' to 'user_uuid'
        },
      });

      // 3. Handle the 'null' case (user not in DB)
      if (!details) {
        return res.status(404).json({ message: "Account not found" });
      }

      // 4. Actually send the data back!
      return res.status(200).json(details);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
export default UserCont;
