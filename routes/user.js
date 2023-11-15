import express from "express"
import { UserController } from '../controllers/index.js'

const router = express.Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.put('/', UserController.updateMyUserInfo)
router.get('/', UserController.getMyUserInfo)

//routes for user account verification


export default router