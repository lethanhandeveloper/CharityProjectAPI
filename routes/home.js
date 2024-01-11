import express from "express";
import { EmailController, HomeController } from "../controllers/index.js";
import Role from "../utils/Role.js";

const router = express.Router();

router.get("/user", HomeController.getCountForHome);
router.get("/admin", HomeController.getCountForAdmin);
router.post("/email", EmailController.sendEmail);
export default router;
