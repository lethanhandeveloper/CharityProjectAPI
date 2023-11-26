import express from "express"
import { AreaController } from '../controllers/index.js'
import auth from '../middlewares/auth.js'
import Role from '../utils/Role.js'

const router = express.Router()

router.post('/province', auth([Role.admin]), AreaController.addNewProvince)
router.get('/province', AreaController.getAllProvince)
router.delete('/province/:id', auth([Role.admin]), AreaController.deleteProvinceById)
router.put('/province/:id', auth([Role.admin]), AreaController.updateProvinceById)

router.post('/district', auth([Role.admin]), AreaController.addNewDistrict)
router.get('/district', AreaController.getAllDistrict)
router.delete('/district/:id', auth([Role.admin]), AreaController.deleteDistrictbyId)
router.get('/district/:provinceId/province', AreaController.getDistrictByProvinceId)
router.put('/district/:id', auth([Role.admin]), AreaController.updateDistrictById)

router.post('/commune', auth([Role.admin]), AreaController.addNewCommune)
router.get('/commune', AreaController.getAllCommune)
router.get('/commune/:districtId/district', AreaController.getCommuneByDistrictId)
router.delete('/commune/:id', auth([Role.admin]), AreaController.deleteCommuneById)
router.delete('/commune', auth([Role.admin]), AreaController.deleteAllCommune)
router.put('/commune/:id', auth([Role.admin]), AreaController.updateCommuneById)

export default router