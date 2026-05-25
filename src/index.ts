import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import user_route from "./routes/user.routes.ts";
import auth_route from "./routes/oauth.routes.ts";
import sub_route from "./routes/subscriber.route.ts";
import admin_route from "./routes/admin.routes.ts";
import { connectRedis } from "./redis.ts";

const app = express();
const PORT = 7000;
console.log("DB URL:", process.env.DATABASE_URL);
connectRedis();
// Middleware to parse JSON
app.use((req, res, next) => {
  console.log("🌍 GLOBAL HIT:", req.method, req.url);
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use("/subscriber", user_route);
app.use("/auth", auth_route);
app.use("/sub");
app.use("/admin");
app.get("/", (req, res) => {
  res.send("Server is running smoothly with pnpm!");
});
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
