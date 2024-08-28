import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import FeedbackRouter from "./src/routes/feedback.route";
import cors from "cors";
dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use("/feedback", FeedbackRouter);
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
