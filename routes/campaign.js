import express from "express";
import { CampaignController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import Role from "../utils/Role.js";

const router = express.Router();

router.post(
  "/category",
  auth([Role.admin]),
  CampaignController.CategoryController.addNewCampaignCategory
);

router.get(
  "/category",
  CampaignController.CategoryController.getAllCampaignCategory
);
router.post(
  "/category",
  auth([Role.admin]),
  CampaignController.CategoryController.addNewCampaignCategory
);
router.delete(
  "/category/:id",
  auth([Role.admin]),
  CampaignController.CategoryController.deleteCampaignCategoryById
);

router.get("/itemtype", CampaignController.ItemTypeController.getAllItemType);
router.post(
  "/itemtype",
  auth([Role.admin]),
  CampaignController.ItemTypeController.addNewItemType
);
router.delete(
  "/itemtype/:id",
  auth([Role.admin]),
  CampaignController.ItemTypeController.deleteItemTypeById
);

router.post(
  "/",
  auth([Role.admin]),
  CampaignController.CampaignController.addNewCampaign
);
router.get("/", CampaignController.CampaignController.getAllCampaign);
router.post(
  "/filter",
  CampaignController.CampaignController.getCampaignByFilter
);
router.post("/list", CampaignController.CampaignController.getCampaignByFilter);

router.get("/:id", CampaignController.CampaignController.getCampaignDetail);
router.get(
  "/user",
  CampaignController.CampaignController.getCampaignByCurrentUser
);
router.get("/home", CampaignController.CampaignController.getCampaignHome);

export default router;
