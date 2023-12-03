import express from "express";
import { AreaController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import Role from "../utils/Role.js";

const router = express.Router();

router.get("/province/list", AreaController.ProvinceController.getAllProvince);
router.post("/province/list", AreaController.ProvinceController.getAllProvince);

router.delete(
  "/province/:id",
  auth([Role.admin]),
  AreaController.ProvinceController.deleteProvinceById
);
router.post(
  "/province/create",
  AreaController.ProvinceController.addNewProvince
);
router.patch(
  "/province/update",
  auth([Role.admin]),
  AreaController.ProvinceController.updateProvinceById
);

router.post(
  "/district/create",

  AreaController.DistrictController.addNewDistrict
);
router.get("/district/list", AreaController.DistrictController.getAllDistrict);
router.post("/district/list", AreaController.DistrictController.getAllDistrict);
router.delete(
  "/district/:id",
  auth([Role.admin]),
  AreaController.DistrictController.deleteDistrictbyId
);
router.get(
  "/district/:provinceId/province",
  AreaController.DistrictController.getDistrictByProvinceId
);
router.patch(
  "/district/update",
  auth([Role.admin]),
  AreaController.DistrictController.updateDistrictById
);

router.post(
  "/commune/create",

  AreaController.CommuneController.addNewCommune
);

router.get("/commune/list", AreaController.CommuneController.getAllCommune);
router.post("/commune/list", AreaController.CommuneController.getAllCommune);

router.get(
  "/commune/:districtId/district",
  AreaController.CommuneController.getCommuneByDistrictId
);

router.delete(
  "/commune/:id",
  auth([Role.admin]),
  AreaController.CommuneController.deleteCommuneById
);

router.delete(
  "/commune",
  auth([Role.admin]),
  AreaController.CommuneController.deleteAllCommune
);

router.patch(
  "/commune/update",
  auth([Role.admin]),
  AreaController.CommuneController.updateCommuneById
);

export default router;
