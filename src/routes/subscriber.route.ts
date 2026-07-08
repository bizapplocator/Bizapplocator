import { Router } from "express";
import UserCont from "../controllers/User/user.contoller.ts";
import { prisma } from "../lib/db.ts";
import Auth_middleware from "../middleware/auth.middleware.ts";
import rateLimit from "express-rate-limit";
import subController from "../controllers/sub.controller.ts";
import { ProductSearchEngine } from "../controllers/Logic/search.logic.ts";
const router = Router();
const user_controller_class = new UserCont();
const subClass = new subController();
const auth_midleware = new Auth_middleware();
const search_class = new ProductSearchEngine(prisma);

const subscriber_rate_limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
router.use(subscriber_rate_limit);
router.use(auth_midleware.authenticate);
router.get("/data", (req, res) => user_controller_class.getUserData(req, res));
router.post("/create-product", subClass.create_product_handler);
router.patch("/update-product", subClass.update_product_handler);
router.delete("/delete-product", subClass.delete_product_handler);
router.get("/product/getAllProducts", subClass.get_handler);
router.get("/products/search-products", search_class.handleProductSearch);
export default router;
