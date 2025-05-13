import { Router } from 'express';
import { getActivities, getActivitiesByID  } from '../controllers/activities.controller.js';
import { authenticateUserOrOng } from '../services/authentication.js';

const router = Router();

router.get("/", authenticateUserOrOng, getActivities);
router.get("/:id", authenticateUserOrOng, getActivitiesByID);

export default router;