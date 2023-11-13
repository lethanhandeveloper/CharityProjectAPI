import express from "express"
import { UserController } from '../controllers/index.js'

const router = express.Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/', UserController.getMyUserInfo)

export default router