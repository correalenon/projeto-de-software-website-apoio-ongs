import { Router } from 'express';
import { getProjects, getProjectsByID, postProject, putProjectByID, deleteProjectByID } from '../controllers/projects.controller.js';
import { authenticateUser } from '../services/authentication.js';

const router = Router();

router.get("/", authenticateUser, getProjects);
router.get("/:id", authenticateUser, getProjectsByID);
router.post("/", authenticateUser, postProject);
router.put("/:id", authenticateUser, putProjectByID);
router.delete("/:id", authenticateUser, deleteProjectByID);

export default router;