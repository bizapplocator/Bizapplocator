import "dotenv/config";
import express from "express";

import cookieParser from "cookie-parser";
import user_route from "./routes/public.route.ts";
import auth_route from "./routes/oauth.routes.ts";
import sub_route from "./routes/subscriber.route.ts";
import admin_route from "./routes/admin.routes.ts";
import { connectRedis } from "./redis.ts";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import fs from "fs";
import YAML from "yaml"; // run: pnpm add yaml

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerSpec = YAML.parse(file);
const app = express();
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "My API", version: "1.0.0" },
  },
  // This looks at all your .ts files for /** @openapi */ comments
  apis: ["./src/routes/public.route.ts"],
};

// Serve the UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
app.use("/sub", sub_route);
app.use("/admin", admin_route);
app.get("/", (req, res) => {
  res.send("Server is running smoothly with pnpm!");
});
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
