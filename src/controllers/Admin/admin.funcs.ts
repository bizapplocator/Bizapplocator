import { prisma } from "../../lib/db.ts";
import type { Response, Request } from "express";

export class AdminFuncs {
  // Add this to your AdminControl class
  getPendingVerifications = async (req: Request, res: Response) => {
    try {
      // Fetch all records with PENDING status
      const pendingList = await prisma.verificationUpdate.findMany({
        where: {
          verificationStatus: "PENDING",
        },
        include: {
          // This brings in the business details so the admin knows who they are
          businessOwnerAuth: {
            select: {
              businessName: true,
              ownerFullName: true,
              emailAddress: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc", // Show the oldest requests first
        },
      });

      res.status(200).json({
        message: "Pending verifications fetched",
        count: pendingList.length,
        data: pendingList,
      });
    } catch (error) {
      console.error("Fetch pending error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Add this to your AdminControl class
  approveSubscriber = async (req: Request, res: Response) => {
    try {
      const { verificationId } = req.params;
      const { remarks } = req.body;

      // Assumes your middleware adds the admin info to req.user
      const adminId = req.user?.id;

      if (!adminId) {
        return res.status(401).json({ message: "Admin unauthorized" });
      }

      // Use a transaction to ensure both the verification record
      // and the account role update succeed or fail together
      const result = await prisma.$transaction(async (tx) => {
        // 1. Update AND include the relation
        const updatedVerification = await tx.verificationUpdate.update({
          where: { id: verificationId as string },
          data: {
            verificationStatus: "APPROVED",
            dateVerified: new Date(),
            verifiedById: adminId,
            remarks: remarks || "Verification approved",
          },
          // This tells Prisma to fetch the related record
          include: {
            businessOwnerAuth: true,
          },
        });

        // Now TypeScript will see 'businessOwnerAuth' because you included it
        const targetAccountId = updatedVerification.businessOwnerAuth.accountId;

        await tx.accounts.update({
          where: { id: targetAccountId },
          data: { role: "SUBSCRIBER" },
        });

        return updatedVerification;
      });
      res.status(200).json({
        message: "Subscriber approved and upgraded successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Approval error:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
}
