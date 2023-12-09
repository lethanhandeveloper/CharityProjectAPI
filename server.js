import express from "express";
import cors from "cors";
import {
  userRouter,
  areaRouter,
  mapRouter,
  bannerRouter,
  campaignRouter,
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

import twilio from "twilio";

app.use("/authsdt", (req, res) => {
  const accountSid = 'ACf89eec8fd034140f10c92584c196fa9b';
  const authToken = '982dde939ab1c991ed6c6f698a45899f';
  const client = twilio(accountSid, authToken);

  client.messages
    .create({ from: '+84337464921', body: 'Ahoy, world!', to: '+84337464921' })
    .then(message => console.log(message.sid));
});

app.use((req, res) => {
  res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Route not found" });
});

const port = process.env.SERVER_PORT ?? 3000;

app.listen(port, async () => {
  console.log("Server is starting");
  await connectDatabase();
});
