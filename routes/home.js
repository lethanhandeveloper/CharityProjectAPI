import express from "express";
import { HomeController } from "../controllers/index.js";

const router = express.Router();

router.get("/user", HomeController.getCountForHome);
router.get("/admin", HomeController.getCountForAdmin);

export default router;
