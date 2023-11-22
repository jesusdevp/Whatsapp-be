import express from 'express'
import trimRequest from 'trim-request';
import { 
    checkUserEmail,
    login, 
    logout, 
    refreshToken, 
    register 
} from '../controllers/auth.controller.js';

const router = express.Router()

router.route('/register').post(trimRequest.all ,register)
router.route('/login').post(trimRequest.all, login)
router.route('/logout').post(trimRequest.all, logout)
router.route('/refreshtoken').post(trimRequest.all, refreshToken)
router.route('/checkemail').post(trimRequest.all, checkUserEmail)

export default router;