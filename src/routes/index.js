import express from 'express'
import authRoutes from './auth.routes.js'
import conversationRoutes from './conversation.routes.js'
import messageRoutes from './message.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/conversation', conversationRoutes)
router.use('/message', messageRoutes)

export default router;