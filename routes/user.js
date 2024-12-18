import express from "express";
import {
  UserController,
  VerificationController,
} from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import requestLimit from "../middlewares/requestlimit.js";
import Role from "../utils/Role.js";

const router = express.Router();

router.post(
  "/register/getcode",
  // requestLimit,
  UserController.sendRegistionCode
);

router.post(
  "/email/donate",
  // requestLimit,
  UserController.sendDonate
);
router.post(
  "/email/cancel",
  // requestLimit,
  UserController.sendCancel
);
router.post(
  "/email/finish",
  // requestLimit,
  UserController.sendFinish
);

router.patch(
  "/changeactivestatus/:id",
  auth([Role.admin]),
  // requestLimit,
  UserController.changeActiveStatus
);

router.post(
  "/phonenumber/getcode",
  // requestLimit,
  UserController.getPhoneNumberCode
);

router.post(
  "/phonenumber/validate",
  // requestLimit,
  UserController.validatePhoneNumber
);
router.post(
  "/email/validate",
  // requestLimit,
  UserController.validateEmail
);

router.get("/refreshtoken", UserController.getAccessToken);

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get(
  "/getbyname/:name",
  auth([Role.admin]),
  UserController.getUserByName
);
router.get(
  "/getbyid/:id",

  UserController.getUserByID
);
router.patch("/", UserController.updateMyUserInfo);

router.get(
  "/verification/myrequest",
  auth([Role.personal, Role.organization, Role.user]),
  VerificationController.getRequestByCurrentUser
);
router.post(
  "/verification/myrequest/:id",
  auth([Role.personal, Role.organization, Role.user]),
  VerificationController.updateMyRequestById
);

router.post(
  "/verification/paginate/:status/:type",
  auth([Role.admin]),
  VerificationController.getVerificationRequestByPagination
);

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
  "/verification/update/:id",
  auth([Role.user]),
  VerificationController.updateMyRequestById
);
router.patch(
  "/verification/:id",
  auth([Role.admin]),
  VerificationController.updateRequestStatus
);

router.get("/verification/user/:id", VerificationController.getRequestByUserId);
router.get("/verification/:id", VerificationController.getRequestById);

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

router.post(
  "/list",
  auth([Role.user, Role.admin]),
  UserController.getUserListByPage
);
router.post(
  "/listinactive",
  auth([Role.user, Role.admin]),
  UserController.getUserInActiveListByPage
);

router.get("/home", UserController.getHomePageUser);
router.post("/setactive", auth([Role.admin]), UserController.setActive);
router.post("/updatepass", UserController.updatePass);
router.post("/forgetpass", UserController.forgotPass);

export default router;
