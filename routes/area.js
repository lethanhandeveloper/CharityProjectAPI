import express from "express"
import { AreaController } from '../controllers/index.js'
import checkAdminRole from "../middlewares/admin.js";

const router = express.Router()

router.post('/province', checkAdminRole, AreaController.addNewProvince)
router.get('/province', AreaController.getAllProvince)

router.post('/district', checkAdminRole, AreaController.addNewDistrict)
router.get('/district', AreaController.getAllDistrict)
router.get('/district/:provinceId/province', AreaController.getDistrictByProvinceId)

router.post('/commune', checkAdminRole, AreaController.addNewCommune)
router.get('/commune', AreaController.getAllCommune)
router.get('/commune/:districtId/district', AreaController.getCommuneByDistrictId)
router.delete('/commune', checkAdminRole, AreaController.deleteAllCommune)

export default router