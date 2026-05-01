import express from "express";
import subscriber_route from "./routes/subscriber_routes.ts";
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use("/subscriber", subscriber_route);
app.get("/", (req, res) => {
  res.send("Server is running smoothly with pnpm!");
});

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
