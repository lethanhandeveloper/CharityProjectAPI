import express from "express";
import { MapController } from "../controllers";
const router = express.Router();

router.get("/list", MapController.getMapList);
router.post("/update", MapController.updateMap);
router.post("/create", MapController.addNewMap);

export default router;
