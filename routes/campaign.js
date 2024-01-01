import express from "express";
import {
  CampaignController,
  DonationTransactionHash,
} from "../controllers/index.js";
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

router.post(
  "/category/paginate",
  auth([Role.admin]),
  CampaignController.CategoryController.getCategoryByPagination
);

router.delete(
  "/category/:id",
  auth([Role.admin]),
  CampaignController.CategoryController.deleteCampaignCategoryById
);

router.post(
  "/donation/addtransactionhash",
  // auth([Role.admin]),
  DonationTransactionHash.addNewDonationTransactionHash
);

router.get(
  "/donation/gettransactionhash/:id",
  // auth([Role.admin]),
  DonationTransactionHash.getDonationTransactionHashByTransactionId
);

router.get("/itemtype", CampaignController.ItemTypeController.getAllItemType);
router.get(
  "/itemtype/paginate",
  CampaignController.ItemTypeController.getItemTypeByPagination
);
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
router.post("/byuser", CampaignController.CampaignController.getCampaignByUser);
router.get("/home", CampaignController.CampaignController.getCampaignHome);
router.patch(
  "/updateStatus",
  CampaignController.CampaignController.updateStatus
);

router.get("/:id", CampaignController.CampaignController.getCampaignDetail);
router.post(
  "/paginate/:status",
  CampaignController.CampaignController.getCampaignByPagination
);

router.post(
  "/user",
  CampaignController.CampaignController.getCampaignByCurrentUser
);

export default router;
