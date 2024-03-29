import express from "express";
import cors from "cors";
import {
  userRouter,
  areaRouter,
  mapRouter,
  bannerRouter,
  campaignRouter,
  homeRouter,
  feedbackRouter,
  fileRouter,
} from "./routes/index.js";
import connectDatabase from "./databases/database.js";
import * as dotenv from "dotenv";
import HttpStatusCode from "./utils/HttpStatusCode.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors());
app.use("/user", userRouter);
app.use("/area", areaRouter);
app.use("/map", mapRouter);
app.use("/campaign", campaignRouter);
app.use("/banner", bannerRouter);
app.use("/home", homeRouter);
app.use("/feedback", feedbackRouter);
app.use("/file", fileRouter);

app.use((req, res) => {
  res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Route not found" });
});

const port = process.env.SERVER_PORT ?? 3000;

app.listen(port, async () => {
  console.log("Server is starting");
  await connectDatabase();
});
