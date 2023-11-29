import express from "express";
import { AreaController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import Role from "../utils/Role.js";

const router = express.Router();

router.post(
  "/province",
  auth([Role.admin]),
  AreaController.ProvinceController.addNewProvince
);
router.get("/province", AreaController.ProvinceController.getAllProvince);
router.delete(
  "/province/:id",
  auth([Role.admin]),
  AreaController.ProvinceController.deleteProvinceById
);
router.put(
  "/province/:id",
  auth([Role.admin]),
  AreaController.ProvinceController.updateProvinceById
);

router.post(
  "/district",
  auth([Role.admin]),
  AreaController.DistrictController.addNewDistrict
);
router.get("/district", AreaController.DistrictController.getAllDistrict);
router.delete(
  "/district/:id",
  auth([Role.admin]),
  AreaController.DistrictController.deleteDistrictbyId
);
router.get(
  "/district/:provinceId/province",
  AreaController.DistrictController.getDistrictByProvinceId
);
router.put(
  "/district/:id",
  auth([Role.admin]),
  AreaController.DistrictController.updateDistrictById
);

router.post(
  "/commune",
  auth([Role.admin]),
  AreaController.CommuneController.addNewCommune
);
router.get("/commune", AreaController.CommuneController.getAllCommune);
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
router.put(
  "/commune/:id",
  auth([Role.admin]),
  AreaController.CommuneController.updateCommuneById
);

export default router;
