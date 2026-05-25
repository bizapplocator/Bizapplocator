import type { Request, Response } from "express";
import { prisma } from "../lib/db.ts";
import { businessOwnerAuthSchema } from "../routes/schemas/bizVerification.schema.ts";
class subController {
  register_sub = async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.sub!;
      if (!user_id) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
      const new_role = "SUBSCRIBER";
      const alter_user = await prisma.accounts.update({
        where: {
          id: user_id,
        },
        data: {
          role: new_role,
        },
      });
    } catch (e) {
      res.status(400).send({
        message: "Internal Server error",
      });
    }
  };
  add_business_details = async (req: Request, res: Response) => {
    try {
      let validateForm = businessOwnerAuthSchema.safeParse(req.body);
      if (!validateForm.success) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
      const user_id = req.user?.sub!;
      const save_sub_data = await prisma.businessOwnerAuth.create({
        data: {
          // Let Prisma generate a new CUID for 'id' automatically
          // or keep id: user_id ONLY if you want the IDs to be identical.

          businessName: validateForm.data.businessName,
          businessRegistrationNumber:
            validateForm.data.businessRegistrationNumber || null,
          ownerFullName: validateForm.data.ownerFullName,
          dateOfBirth: new Date(validateForm.data.dateOfBirth),
          nin: validateForm.data.nin,
          phoneNumber: validateForm.data.phoneNumber,
          emailAddress: validateForm.data.emailAddress,
          businessAddress: validateForm.data.businessAddress,
          typeOfBusiness: validateForm.data.typeOfBusiness,
          meansOfIdentification: validateForm.data.meansOfIdentification,
          identificationNumber: validateForm.data.identificationNumber,
          declarationConfirmed: validateForm.data.declarationConfirmed,
          ownerSignature: validateForm.data.ownerSignature,
          signatureDate: new Date(validateForm.data.signatureDate),

          // ✅ FIX 1: Link to the Account via the accountId relation
          account: {
            connect: { id: user_id },
          },

          // ✅ FIX 2: Correctly nested Verification record
          verification: {
            create: {
              verificationStatus: "PENDING",
              // Ensure dateVerified and verifiedById are optional in your schema!
            },
          },
        }, // Removed the extra brace that was here
      });
      if (save_sub_data) {
        res.status(201).send({
          message: "Status changed successfully",
        });
        return;
      }
    } catch (e) {
      console.log(`This is the user to sub change error ${e}`);
      res.status(400).send({
        message: "Server error",
      });
    }
  };
}
