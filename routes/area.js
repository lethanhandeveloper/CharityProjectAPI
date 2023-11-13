import express from "express"
import { AreaController } from '../controllers/index.js'

const router = express.Router()

router.post('/commune', AreaController.addNewCommune)
router.get('/commune', AreaController.getAllCommune)
router.delete('/commune', AreaController.deleteAllCommune)

router.post('/province', AreaController.addNewProvince)
router.get('/province', AreaController.getAllProvince)

router.post('/district', AreaController.addNewDistrict)
router.get('/district', AreaController.getAllDistrict)


export default router