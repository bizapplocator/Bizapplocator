import { z } from "zod";

// --- ENUMS ---
export const IdentificationType = z.enum([
  "NATIONAL_ID",
  "VOTERS_CARD",
  "DRIVERS_LICENSE",
  "INTERNATIONAL_PASSPORT",
]);

export const VerificationStatus = z.enum(["APPROVED", "PENDING", "REJECTED"]);

// --- USER SUBMISSION SCHEMA ---
export const businessOwnerAuthSchema = z
  .object({
    // Business Details
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters")
      .max(100)
      .trim(),

    // ✅ FIX 1: Preprocess to handle uppercase BEFORE regex and handle the union correctly
    businessRegistrationNumber: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      z
        .string()
        .regex(
          /^(BN|RC|IT|LL)\d{5,7}$/,
          "Invalid CAC registration number format",
        )
        .optional()
        .or(z.literal("")),
    ),

    // Owner Details
    ownerFullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(150)
      .trim(),

    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .refine((val) => {
        const birthDate = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age >= 18;
      }, "Owner must be at least 18 years old"),

    nin: z
      .string()
      .length(11, "NIN must be exactly 11 digits")
      .regex(/^\d+$/, "NIN must contain numbers only"),

    phoneNumber: z
      .string()
      .regex(
        /^(\+234|0)[789][01]\d{8}$/,
        "Enter a valid Nigerian phone number",
      ),

    emailAddress: z.string().email().toLowerCase().trim(),

    businessAddress: z.string().min(10, "Provide a complete address").trim(),

    typeOfBusiness: z.string().min(3, "Specify business type").trim(),

    meansOfIdentification: IdentificationType,

    identificationNumber: z.string().trim(),

    // Declaration
    declarationConfirmed: z
      .boolean()
      .refine((val) => val === true, "Must accept declaration"),

    ownerSignature: z
      .string()
      .min(3, "Please type your full name as signature")
      .trim(),

    // ✅ FIX 2: Prevent future-dated signatures
    signatureDate: z
      .string()
      .datetime()
      .refine(
        (val) => new Date(val) <= new Date(),
        "Signature date cannot be in the future",
      ),
  })
  // ✅ FIX 3: SuperRefine for Nigerian ID Formats
  .superRefine((data, ctx) => {
    const formats: Record<string, { regex: RegExp; message: string }> = {
      NATIONAL_ID: {
        regex: /^\d{11}$/,
        message: "NIN must be 11 digits",
      },
      VOTERS_CARD: {
        regex: /^[A-Z0-9\s]{10,25}$/i, // Voter cards vary, but usually contain alphanumeric chars
        message: "Invalid Voter's Card format",
      },
      DRIVERS_LICENSE: {
        regex: /^[A-Z]{3}(\s|-)([A-Z0-9\s-]{6,15})$/i,
        message: "Invalid Driver's License format",
      },
      INTERNATIONAL_PASSPORT: {
        regex: /^[A-Z]\d{8}$/i,
        message: "Invalid Passport format (e.g., A01234567)",
      },
    };

    const rule = formats[data.meansOfIdentification];
    if (rule && !rule.regex.test(data.identificationNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["identificationNumber"],
        message: rule.message,
      });
    }
  });

// --- ADMIN / OFFICE SCHEMA ---
export const verificationUpdateSchema = z.object({
  verificationStatus: VerificationStatus,
  verifiedBy: z.string().min(1, "Admin name is required"),
  remarks: z.string().trim().max(500).optional(),
  // ✅ FIX 4: Prevent future-dated verification
  dateVerified: z
    .string()
    .datetime()
    .refine(
      (val) => new Date(val) <= new Date(),
      "Verification date cannot be in the future",
    ),
});

export type BusinessOwnerAuthInput = z.infer<typeof businessOwnerAuthSchema>;
export type VerificationUpdate = z.infer<typeof verificationUpdateSchema>;
