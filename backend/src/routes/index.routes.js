import {Router} from "express";
import loginRoutes from "./login.routes.js";
import usersRoutes from "./users.routes.js";
import ongsRoutes from "./ongs.routes.js";
import projectsRoutes from "./projects.routes.js";
import activitiesRoutes from "./activities.routes.js";
import postsRoutes from "./posts.routes.js";
import commentsRoutes from "./comments.routes.js";
import filtersRoutes from "./filters.routes.js";


const router = Router();

router.use("/api/v1/login", loginRoutes);
router.use("/api/v1/users", usersRoutes);
router.use("/api/v1/ongs", ongsRoutes);
router.use("/api/v1/projects", projectsRoutes);
router.use("/api/v1/activities", activitiesRoutes);
router.use("/api/v1/posts", postsRoutes);
router.use("/api/v1/comments", commentsRoutes);
router.use("/api/v1/filters", filtersRoutes);
export default router;
