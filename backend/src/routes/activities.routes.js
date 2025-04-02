import { Router } from 'express';
import { getActivities, getActivitiesByID  } from '../controllers/activities.controller.js';
import { authenticateUser } from '../services/authentication.js';

const router = Router();

router.get("/", authenticateUser, getActivities);
router.get("/:id", authenticateUser, getActivitiesByID);

export default router;