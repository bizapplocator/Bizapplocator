import { Router } from "express";
import Auth_middleware from "../middleware/auth.middleware.ts";
import { ProductSearchEngine } from "../controllers/Logic/search.logic.ts";
import { prisma } from "../lib/db.ts";
const router = Router();
const search_class = new ProductSearchEngine(prisma);
const authBouncer = new Auth_middleware();
router.use(authBouncer.authenticateUser);
router.get("/search-products", search_class.handleProductSearch);
