import express, { Request, Response } from "express";
import ruleRouter from "./routes/rules.route";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/rules", ruleRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is Running" });
});

setInterval(async () => {
  const res: any = await fetch("https://rule-engine-pmwb.onrender.com/");
  console.log(res.message);
}, 14 * 60 * 1000);

export default app;
