import express from "express"
import { UserController, VerificationController } from '../controllers/index.js'
import checkToken from "../middlewares/user.js"

const router = express.Router();

router.post('/register', UserController.register)
router.post('/login', UserController.login)



router.post('/verification/:type', checkToken, VerificationController.addNewVerificationRequest)
// router.patch('/user/verification', checkToken, VerificationController.addNewVerificationRequest)

router.put('/', checkToken, UserController.updateMyUserInfo)
router.get('/', checkToken, UserController.getMyUserInfo)

export default router;
