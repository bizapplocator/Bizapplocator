import { Router } from "express";
import Auth_middleware from "../middleware/auth.middleware.ts";
import { ProductSearchEngine } from "../controllers/Logic/search.logic.ts";
import { prisma } from "../lib/db.ts";
import rateLimit from "express-rate-limit";
import { SocketClass } from "../sockets/socket_handler.ts";
const router = Router();
const user_rate_limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
const search_class = new ProductSearchEngine(prisma);
const authBouncer = new Auth_middleware();
const socket_functions = new SocketClass();
router.use(authBouncer.authenticateUser);
router.use(user_rate_limit);
router.get("/search-products", search_class.handleProductSearch);
router.post("/create_chat", socket_functions.create_chat);
router.get("/messages/:chat_id", socket_functions.get_chat_messages);
router.delete("/chat/:chat_id/images", socket_functions.delete_chat_images);
router.delete("/chat/:chat_id/messages", socket_functions.delete_chat_messages);
router.delete("/chat/:chat_id", socket_functions.delete_chat_room);
