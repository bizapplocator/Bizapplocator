import { Router } from "express";
import AdminControl from "../controllers/Admin/admin.controller.ts";
import Auth_middleware from "../middleware/auth.middleware.ts";
import rateLimit from "express-rate-limit";
const route = Router();
const adminClass = new AdminControl();
const middleware_class = new Auth_middleware();

const admin_rate_limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
// Ensure all routes under this router use the admin middleware
route.use(middleware_class.admin_auth);
route.use(admin_rate_limit);
// Existing Routes
route.get("/totalusers", adminClass.UserCount);
route.get("/totalsub", adminClass.SubCount);

// New Routes for Verification Logic
// GET: Fetch all pending verification requests
route.get("/pending-verifications", adminClass.getPendingVerifications);

// PATCH/POST: Approve a specific subscriber
// Parameters: verificationId (from URL params), remarks (from body)
route.patch("/approve/:verificationId", adminClass.approveSubscriber);

export default route;
