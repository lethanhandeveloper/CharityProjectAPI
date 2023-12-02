import express from "express";
import { BannerController } from "../controllers/index.js";

const router = express.Router();

router.post("/all", BannerController.getAllList);
router.post("/create", BannerController.addNewBanner);
router.patch("/update", BannerController.updateBaner);
router.get("/banner/:id", BannerController.deleteBanner);

export default router;
