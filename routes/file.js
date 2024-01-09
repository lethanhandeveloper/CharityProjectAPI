import express from "express";
import { FileController } from "../controllers/index.js";

const router = express.Router();

router.post("/create", FileController.addFile);

router.get("/:id", FileController.getFile);

export default router;
