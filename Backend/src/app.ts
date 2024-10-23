import express, { Request, Response } from "express";
import ruleRouter from "./routes/rules.route";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/rules", ruleRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Running");
});

export default app;
