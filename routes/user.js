import express from "express"
import { UserController } from '../controllers/index.js'
import checkToken from "../middlewares/user.js"

const router = express.Router();

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.put('/', checkToken, UserController.updateMyUserInfo)
router.get('/', checkToken, UserController.getMyUserInfo)

//routes for user account verification

export default router;
