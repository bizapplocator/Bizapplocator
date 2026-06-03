import type { Request, Response } from "express";
import { prisma } from "../lib/db.ts";
import { businessOwnerAuthSchema } from "../routes/schemas/bizVerification.schema.ts";
import {
  createProductSchema,
  updateProductSchema,
} from "../routes/schemas/request_data.schema.ts";
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
  create_product_handler = async (req: Request, res: Response) => {
    try {
      const valid_data = createProductSchema.safeParse(req.body);
      if (!valid_data.success) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }

      const user_id = req.user?.sub!;
      if (!user_id) {
        res.status(401).send({
          message: "Unauthorized",
        });
        return;
      }

      const { media, ...productData } = valid_data.data;

      const new_product = await this.createProduct(
        { ...productData, userId: user_id },
        media ?? [],
      );

      res.status(201).send({
        message: "Product created successfully",
        data: new_product,
      });
    } catch (e) {
      console.log(`Create product error: ${e}`);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  get_handler = async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.sub!;
      const { slug } = req.params as { slug: string };

      // if slug is passed fetch single product otherwise fetch all user products
      if (slug) {
        const product = await this.getProductBySlug(slug);
        if (!product) {
          res.status(404).send({
            message: "Product not found",
          });
          return;
        }
        res.status(200).send({
          message: "Product fetched successfully",
          data: product,
        });
        return;
      }

      const products = await this.getUserProducts(user_id);
      res.status(200).send({
        message: "Products fetched successfully",
        data: products,
      });
    } catch (e) {
      console.log(`Get product error: ${e}`);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  update_product_handler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) {
        res.status(400).send({
          message: "Product id is required",
        });
        return;
      }

      const valid_data = updateProductSchema.safeParse(req.body);
      if (!valid_data.success) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }

      const updated_product = await this.updateProduct(id, valid_data.data);
      res.status(200).send({
        message: "Product updated successfully",
        data: updated_product,
      });
    } catch (e) {
      console.log(`Update product error: ${e}`);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };

  delete_product_handler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) {
        res.status(400).send({
          message: "Product id is required",
        });
        return;
      }

      await this.deleteProduct(id);
      res.status(200).send({
        message: "Product deleted successfully",
      });
    } catch (e) {
      console.log(`Delete product error: ${e}`);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };
  createProduct = async (data: any, mediaItems: any[]) => {
    return await prisma.product.create({
      data: {
        ...data,
        media: {
          create: mediaItems, // Array of { url, altText, rank }
        },
      },
      include: { media: true },
    });
  };
  // Fetch one product by slug
  getProductBySlug = async (slug: string) => {
    return await prisma.product.findUnique({
      where: { slug },
      include: { media: { orderBy: { rank: "asc" } } },
    });
  };

  // Fetch all products for a user
  getUserProducts = async (userId: string) => {
    return await prisma.product.findMany({
      where: { userId },
      include: { media: { orderBy: { rank: "asc" } } },
    });
  };
  deleteProduct = async (id: string) => {
    return await prisma.product.delete({
      where: { id },
    });
  };
  updateProduct = async (id: string, data: any) => {
    return await prisma.product.update({
      where: { id },
      data,
    });
  };
}
export default subController;
