import express from "express";
import { AreaController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import Role from "../utils/Role.js";
import FeedbackController from "../controllers/FeedbackController.js";

const router = express.Router();

router.patch(
  "/setshowinhomepage/:id",
  auth([Role.admin]),
  FeedbackController.setShowInHomepage
);

router.get("/getforhomepage", FeedbackController.getForHomepage);

router.post(
  "/paginate",
  auth([Role.admin]),
  FeedbackController.getFeedbackByPagination
);

router.post("/", auth([Role.admin]), FeedbackController.addNewFeedback);

router.get("/", FeedbackController.getAllFeedback);

router.put("/:id", auth([Role.admin]), FeedbackController.updateFeedbackById);

router.delete(
  "/:id",
  auth([Role.admin]),
  FeedbackController.deleteFeedbackById
);

export default router;
