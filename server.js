import express from "express";
import cors from "cors";
import {
  userRouter,
  areaRouter,
  mapRouter,
  bannerRouter,
} from "./routes/index.js";
import connectDatabase from "./databases/database.js";
import * as dotenv from "dotenv";
import checkToken from "./middlewares/auth.js";
import HttpStatusCode from "./utils/HttpStatusCode.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(checkToken);
app.use(cors());
app.use("/user", userRouter);
app.use("/area", areaRouter);
app.use("/map", mapRouter);
app.use("/banner", bannerRouter);

app.use((req, res) => {
  res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Route not found" });
});

const port = process.env.SERVER_PORT ?? 3000;

app.listen(port, async () => {
  console.log("Server is starting");
  await connectDatabase();
});
