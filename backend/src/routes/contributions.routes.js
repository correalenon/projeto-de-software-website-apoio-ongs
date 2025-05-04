import { Router } from 'express';
import { authenticateUser } from "../services/authentication.js";
import { deleteContributionByID, getContributionsUser, postContributionUser, putContributionByID, getContributions } from '../controllers/contributions.controller.js';

const router = Router();
router.put("/:id", authenticateUser, putContributionByID);
router.get("/", authenticateUser, getContributionsUser);
router.get("/all", authenticateUser, getContributions);
router.post("/", authenticateUser, postContributionUser);
router.delete("/:id", authenticateUser, deleteContributionByID);

export default router;