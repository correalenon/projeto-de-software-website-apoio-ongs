import { Router } from 'express';
import { getProjects, getProjectsByID, postProject, putProjectByID, deleteProjectByID } from '../controllers/projects.controller.js';
import { authenticateUserOrOng } from '../services/authentication.js';

const router = Router();

router.get("/", authenticateUserOrOng, getProjects);
router.get("/:id", authenticateUserOrOng, getProjectsByID);
router.post("/", authenticateUserOrOng, postProject);
router.put("/:id", authenticateUserOrOng, putProjectByID);
router.delete("/:id", authenticateUserOrOng, deleteProjectByID);

export default router;