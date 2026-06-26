import express from 'express';
import * as userController from '../controllers/user.js';
import { validateUser } from "../middleware/validateUser.js"

const router = express.Router();

router.post('/signup', validateUser, userController.signup);
router.post('/login', validateUser, userController.login);

export default router;