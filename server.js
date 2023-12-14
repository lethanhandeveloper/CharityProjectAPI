import express from "express";
import cors from "cors";
import {
  userRouter,
  areaRouter,
  mapRouter,
  bannerRouter,
  campaignRouter,
  homeRouter,
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

import twilio from "twilio";
app.get("/authsdt", (req, res) => {
  const accountSid = "AC52d5d50543024bd10c6ee92b6385940b";
  const authToken = "15cb777012e7a50219355c403578141d";
  const client = twilio(accountSid, authToken);
  client.messages
    .create({ from: "+12056712883", body: "Ahoy, world!", to: "+840383474327" })
    .then((message) => console.log(message.sid));

  res.status(200).json({ message: "Sucess" });
});

app.use((req, res) => {
  res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Route not found" });
});

const port = process.env.SERVER_PORT ?? 3000;

app.listen(port, async () => {
  console.log("Server is starting");
  await connectDatabase();
});
