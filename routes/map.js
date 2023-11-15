import express from "express";
import { MapController } from "../controllers/index.js";
const router = express.Router();

router.get("/list", MapController.getMapList);
router.post("/update", MapController.updateMap);
router.post("/create", MapController.addNewMap);

export default router;
