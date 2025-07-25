import { Hono } from "hono";
import { cors } from "hono/cors";
import routes from "./routes";

const app = new Hono();

// Apply CORS middleware
app.use(
  "*",
  cors({
    origin: ["https://xell.barrenechea.cl"],
    allowMethods: ["GET", "POST"],
  }),
);

// Mount all routes
app.route("/", routes);

export default app;
