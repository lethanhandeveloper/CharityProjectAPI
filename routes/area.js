import express from "express"
import { AreaController } from '../controllers/index.js'
import checkAdminRole from "../middlewares/admin.js";
import auth from '../middlewares/auth.js'
import Role from '../utils/Role.js'

const router = express.Router()

router.post('/province', auth([Role.admin]), AreaController.addNewProvince)
router.get('/province', AreaController.getAllProvince)

router.post('/district', auth([Role.admin]), AreaController.addNewDistrict)
router.get('/district', AreaController.getAllDistrict)
router.get('/district/:provinceId/province', AreaController.getDistrictByProvinceId)

router.post('/commune', auth([Role.admin]), AreaController.addNewCommune)
router.get('/commune', AreaController.getAllCommune)
router.get('/commune/:districtId/district', AreaController.getCommuneByDistrictId)
router.delete('/commune', auth([Role.admin]), AreaController.deleteAllCommune)

export default router