import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import routes from "./routes";
import cors from "cors";
import corsOptions from "./utils/whitelisting";
import "dotenv/config";
import { checkAuth } from "./middleware/auth.middleware";
declare module "express" {
  interface Request {
    user?: any;
  }
}

const app = express();
const PORT = 4000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", routes.auth);
app.use("/api", checkAuth, routes.api);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend service up and running!");
});

app.listen(PORT, () => {
  console.log(`Backend service is running on port ${PORT}`);
});
