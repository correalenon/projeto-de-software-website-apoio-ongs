import { Router } from "express";
import { authenticateUser } from "../services/authentication.js";
import { getFilterProjects, getFilterActivities, getFilterPosts, getFilterUsers, getFilterOngs } from "../controllers/filters.controller.js";

const router = Router();

router.get("/projects", authenticateUser, getFilterProjects);
router.get("/activities", authenticateUser, getFilterActivities);
router.get("/posts", authenticateUser, getFilterPosts);
router.get("/users", authenticateUser, getFilterUsers);
router.get("/ongs", authenticateUser, getFilterOngs);

export default router;