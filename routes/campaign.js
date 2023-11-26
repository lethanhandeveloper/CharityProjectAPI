import express from "express";
import { CampaignController } from "../controllers/index.js";
import auth from '../middlewares/auth.js'
import Role from '../utils/Role.js'

const router = express.Router();

router.post(
  "/category",
  auth([Role.admin]),
  CampaignController.addNewCampaignCategory
);

router.get("/category", CampaignController.getAllCampaignCategory)
router.post('/category', auth([Role.admin]), CampaignController.addNewCampaignCategory)
router.delete("/category/:id", auth([Role.admin]), CampaignController.deleteCampaignCategoryById)

router.get("/itemtype", CampaignController.getAllItemType)
router.post("/itemtype", auth([Role.admin]), CampaignController.addNewItemType)
router.delete("/itemtype/:id", auth([Role.admin]), CampaignController.deleteItemTypeById)

router.post("/", auth([Role.personal, Role.organization, Role.admin]), CampaignController.addNewCampaign);
router.get("/", CampaignController.getAllCampaign);
router.post("/filter", CampaignController.getCampaignByFilter);
router.get("/:id", CampaignController.getCampaignDetail);
router.get("/user", CampaignController.getCampaignByCurrentUser);

export default router;
