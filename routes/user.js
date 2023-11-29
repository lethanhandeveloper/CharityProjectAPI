import express from "express";
import {
  UserController,
  VerificationController,
} from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import Role from "../utils/Role.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.post(
  "/verification/:type",
  auth([Role.user]),
  VerificationController.addNewVerificationRequest
);
router.get(
  "/verification",
  auth([Role.admin]),
  VerificationController.getAllVerificationRequest
);
router.patch(
  "/verification/:id",
  auth([Role.admin]),
  VerificationController.updateRequestStatus
);

// router.patch('/user/verification', checkToken, VerificationController.addNewVerificationRequest)
router.patch(
  "/avatar",
  auth([Role.user, Role.admin]),
  UserController.updateAvatar
);
router.put("/", auth([Role.user, Role.admin]), UserController.updateMyUserInfo);
router.get(
  "/",
  auth([Role.user, Role.personal, Role.organization, Role.admin]),
  UserController.getMyUserInfo
);

export default router;
