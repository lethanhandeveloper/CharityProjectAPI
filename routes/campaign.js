import express from "express";
import { CampaignController } from "../controllers/index.js";
import checkAdminRole from "../middlewares/admin.js";
import writetocampaign from "../middlewares/writetocampaign.js";

const router = express.Router();

router.post(
  "/category",
  checkAdminRole,
  CampaignController.addNewCampaignCategory
);
router.get("/category", CampaignController.getAllCampaignCategory);
// router.get('/category', AreaController.addNewCommune)

router.get("/itemtype", CampaignController.getAllItemType);
router.post("/itemtype", checkAdminRole, CampaignController.addNewItemType);

router.post("/", checkAdminRole, CampaignController.addNewCampaign);
router.get("/", CampaignController.getAllCampaign);
router.post("/filter", CampaignController.getCampaignByFilter);
router.get("/:id", CampaignController.getCampaignDetail);
router.get("/user", CampaignController.getCampaignByCurrentUser);

export default router;
