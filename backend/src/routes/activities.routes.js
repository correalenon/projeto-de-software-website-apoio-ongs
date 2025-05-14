import { Router } from 'express';
import { getActivities } from '../controllers/activities.controller.js';
import { authenticateUser } from '../services/authentication.js';

const router = Router();

router.get("/", authenticateUser, getActivities);

export default router;